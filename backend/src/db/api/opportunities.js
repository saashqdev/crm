const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class OpportunitiesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const opportunities = await db.opportunities.create(
      {
        id: data.id || undefined,

        title: data.title || null,
        value: data.value || null,
        close_date: data.close_date || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await opportunities.setLead(data.lead || null, {
      transaction,
    });

    await opportunities.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return opportunities;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const opportunitiesData = data.map((item, index) => ({
      id: item.id || undefined,

      title: item.title || null,
      value: item.value || null,
      close_date: item.close_date || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const opportunities = await db.opportunities.bulkCreate(opportunitiesData, {
      transaction,
    });

    // For each item created, replace relation files

    return opportunities;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const opportunities = await db.opportunities.findByPk(
      id,
      {},
      { transaction },
    );

    await opportunities.update(
      {
        title: data.title || null,
        value: data.value || null,
        close_date: data.close_date || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await opportunities.setLead(data.lead || null, {
      transaction,
    });

    await opportunities.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return opportunities;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const opportunities = await db.opportunities.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of opportunities) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of opportunities) {
        await record.destroy({ transaction });
      }
    });

    return opportunities;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const opportunities = await db.opportunities.findByPk(id, options);

    await opportunities.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await opportunities.destroy({
      transaction,
    });

    return opportunities;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const opportunities = await db.opportunities.findOne(
      { where },
      { transaction },
    );

    if (!opportunities) {
      return opportunities;
    }

    const output = opportunities.get({ plain: true });

    output.lead = await opportunities.getLead({
      transaction,
    });

    output.organization = await opportunities.getOrganization({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    const limit = filter.limit || 0;
    let offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    const orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.leads,
        as: 'lead',
      },

      {
        model: db.organizations,
        as: 'organization',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.title) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('opportunities', 'title', filter.title),
        };
      }

      if (filter.calendarStart && filter.calendarEnd) {
        where = {
          ...where,
          [Op.or]: [
            {
              close_date: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
            {
              close_date: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
          ],
        };
      }

      if (filter.valueRange) {
        const [start, end] = filter.valueRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            value: {
              ...where.value,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            value: {
              ...where.value,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.close_dateRange) {
        const [start, end] = filter.close_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            close_date: {
              ...where.close_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            close_date: {
              ...where.close_date,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.lead) {
        const listItems = filter.lead.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          leadId: { [Op.or]: listItems },
        };
      }

      if (filter.organization) {
        const listItems = filter.organization.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          organizationId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.opportunities.count({
            where: globalAccess ? {} : where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.opportunities.findAndCountAll({
          where: globalAccess ? {} : where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit, globalAccess, organizationId) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('opportunities', 'title', query),
        ],
      };
    }

    const records = await db.opportunities.findAll({
      attributes: ['id', 'title'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['title', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.title,
    }));
  }
};
