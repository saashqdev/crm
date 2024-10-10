const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Customer_interactionsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const customer_interactions = await db.customer_interactions.create(
      {
        id: data.id || undefined,

        interaction_date: data.interaction_date || null,
        notes: data.notes || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await customer_interactions.setContact(data.contact || null, {
      transaction,
    });

    await customer_interactions.setUser(data.user || null, {
      transaction,
    });

    await customer_interactions.setOrganization(
      currentUser.organization.id || null,
      {
        transaction,
      },
    );

    return customer_interactions;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const customer_interactionsData = data.map((item, index) => ({
      id: item.id || undefined,

      interaction_date: item.interaction_date || null,
      notes: item.notes || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const customer_interactions = await db.customer_interactions.bulkCreate(
      customer_interactionsData,
      { transaction },
    );

    // For each item created, replace relation files

    return customer_interactions;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const customer_interactions = await db.customer_interactions.findByPk(
      id,
      {},
      { transaction },
    );

    await customer_interactions.update(
      {
        interaction_date: data.interaction_date || null,
        notes: data.notes || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await customer_interactions.setContact(data.contact || null, {
      transaction,
    });

    await customer_interactions.setUser(data.user || null, {
      transaction,
    });

    await customer_interactions.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return customer_interactions;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const customer_interactions = await db.customer_interactions.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of customer_interactions) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of customer_interactions) {
        await record.destroy({ transaction });
      }
    });

    return customer_interactions;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const customer_interactions = await db.customer_interactions.findByPk(
      id,
      options,
    );

    await customer_interactions.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await customer_interactions.destroy({
      transaction,
    });

    return customer_interactions;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const customer_interactions = await db.customer_interactions.findOne(
      { where },
      { transaction },
    );

    if (!customer_interactions) {
      return customer_interactions;
    }

    const output = customer_interactions.get({ plain: true });

    output.contact = await customer_interactions.getContact({
      transaction,
    });

    output.user = await customer_interactions.getUser({
      transaction,
    });

    output.organization = await customer_interactions.getOrganization({
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
        model: db.contacts,
        as: 'contact',
      },

      {
        model: db.users,
        as: 'user',
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

      if (filter.notes) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('customer_interactions', 'notes', filter.notes),
        };
      }

      if (filter.interaction_dateRange) {
        const [start, end] = filter.interaction_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            interaction_date: {
              ...where.interaction_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            interaction_date: {
              ...where.interaction_date,
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

      if (filter.contact) {
        const listItems = filter.contact.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          contactId: { [Op.or]: listItems },
        };
      }

      if (filter.user) {
        const listItems = filter.user.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          userId: { [Op.or]: listItems },
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
          count: await db.customer_interactions.count({
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
      : await db.customer_interactions.findAndCountAll({
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
          Utils.ilike('customer_interactions', 'interaction_date', query),
        ],
      };
    }

    const records = await db.customer_interactions.findAll({
      attributes: ['id', 'interaction_date'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['interaction_date', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.interaction_date,
    }));
  }
};
