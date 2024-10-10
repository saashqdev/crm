const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const customer_interactions = sequelize.define(
    'customer_interactions',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      interaction_date: {
        type: DataTypes.DATE,
      },

      notes: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  customer_interactions.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.customer_interactions.belongsTo(db.contacts, {
      as: 'contact',
      foreignKey: {
        name: 'contactId',
      },
      constraints: false,
    });

    db.customer_interactions.belongsTo(db.users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
      },
      constraints: false,
    });

    db.customer_interactions.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.customer_interactions.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.customer_interactions.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return customer_interactions;
};
