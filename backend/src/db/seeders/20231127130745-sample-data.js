const db = require('../models');
const Users = db.users;

const Contacts = db.contacts;

const CustomerInteractions = db.customer_interactions;

const Leads = db.leads;

const Opportunities = db.opportunities;

const Organizations = db.organizations;

const ContactsData = [
  {
    first_name: 'Alice',

    last_name: 'Johnson',

    email: 'alice.johnson@acme.com',

    phone: '555-0101',

    // type code here for "relation_one" field
  },

  {
    first_name: 'Bob',

    last_name: 'Williams',

    email: 'bob.williams@globex.com',

    phone: '555-0102',

    // type code here for "relation_one" field
  },

  {
    first_name: 'Charlie',

    last_name: 'Brown',

    email: 'charlie.brown@initech.com',

    phone: '555-0103',

    // type code here for "relation_one" field
  },
];

const CustomerInteractionsData = [
  {
    interaction_date: new Date('2023-09-01T10:00:00Z'),

    notes: 'Initial meeting with Acme Corp.',

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    interaction_date: new Date('2023-09-05T14:30:00Z'),

    notes: 'Follow-up call with Globex Inc.',

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    interaction_date: new Date('2023-09-10T09:00:00Z'),

    notes: 'Demo presentation for Initech.',

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const LeadsData = [
  {
    name: 'Acme Corp',

    status: 'Lost',

    category: 'Corporate',

    // type code here for "relation_one" field

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Globex Inc',

    status: 'Qualified',

    category: 'SME',

    // type code here for "relation_one" field

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Initech',

    status: 'Lost',

    category: 'Enterprise',

    // type code here for "relation_one" field

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },
];

const OpportunitiesData = [
  {
    title: 'Acme Corp Expansion',

    value: 50000,

    close_date: new Date('2023-12-15T00:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    title: 'Globex Inc Partnership',

    value: 75000,

    close_date: new Date('2023-11-20T00:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    title: 'Initech Software Upgrade',

    value: 120000,

    close_date: new Date('2024-01-10T00:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const OrganizationsData = [
  {
    name: 'Alfred Wegener',
  },

  {
    name: 'Sigmund Freud',
  },

  {
    name: 'Albrecht von Haller',
  },
];

// Similar logic for "relation_many"

async function associateUserWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User0 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (User0?.setOrganization) {
    await User0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User1 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (User1?.setOrganization) {
    await User1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User2 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (User2?.setOrganization) {
    await User2.setOrganization(relatedOrganization2);
  }
}

async function associateContactWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Contact0 = await Contacts.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Contact0?.setOrganization) {
    await Contact0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Contact1 = await Contacts.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Contact1?.setOrganization) {
    await Contact1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Contact2 = await Contacts.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Contact2?.setOrganization) {
    await Contact2.setOrganization(relatedOrganization2);
  }
}

async function associateCustomerInteractionWithContact() {
  const relatedContact0 = await Contacts.findOne({
    offset: Math.floor(Math.random() * (await Contacts.count())),
  });
  const CustomerInteraction0 = await CustomerInteractions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (CustomerInteraction0?.setContact) {
    await CustomerInteraction0.setContact(relatedContact0);
  }

  const relatedContact1 = await Contacts.findOne({
    offset: Math.floor(Math.random() * (await Contacts.count())),
  });
  const CustomerInteraction1 = await CustomerInteractions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (CustomerInteraction1?.setContact) {
    await CustomerInteraction1.setContact(relatedContact1);
  }

  const relatedContact2 = await Contacts.findOne({
    offset: Math.floor(Math.random() * (await Contacts.count())),
  });
  const CustomerInteraction2 = await CustomerInteractions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (CustomerInteraction2?.setContact) {
    await CustomerInteraction2.setContact(relatedContact2);
  }
}

async function associateCustomerInteractionWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const CustomerInteraction0 = await CustomerInteractions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (CustomerInteraction0?.setUser) {
    await CustomerInteraction0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const CustomerInteraction1 = await CustomerInteractions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (CustomerInteraction1?.setUser) {
    await CustomerInteraction1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const CustomerInteraction2 = await CustomerInteractions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (CustomerInteraction2?.setUser) {
    await CustomerInteraction2.setUser(relatedUser2);
  }
}

async function associateCustomerInteractionWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const CustomerInteraction0 = await CustomerInteractions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (CustomerInteraction0?.setOrganization) {
    await CustomerInteraction0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const CustomerInteraction1 = await CustomerInteractions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (CustomerInteraction1?.setOrganization) {
    await CustomerInteraction1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const CustomerInteraction2 = await CustomerInteractions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (CustomerInteraction2?.setOrganization) {
    await CustomerInteraction2.setOrganization(relatedOrganization2);
  }
}

async function associateLeadWithOwner() {
  const relatedOwner0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Lead0 = await Leads.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Lead0?.setOwner) {
    await Lead0.setOwner(relatedOwner0);
  }

  const relatedOwner1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Lead1 = await Leads.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Lead1?.setOwner) {
    await Lead1.setOwner(relatedOwner1);
  }

  const relatedOwner2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Lead2 = await Leads.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Lead2?.setOwner) {
    await Lead2.setOwner(relatedOwner2);
  }
}

// Similar logic for "relation_many"

async function associateLeadWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Lead0 = await Leads.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Lead0?.setOrganization) {
    await Lead0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Lead1 = await Leads.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Lead1?.setOrganization) {
    await Lead1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Lead2 = await Leads.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Lead2?.setOrganization) {
    await Lead2.setOrganization(relatedOrganization2);
  }
}

async function associateOpportunityWithLead() {
  const relatedLead0 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Opportunity0 = await Opportunities.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Opportunity0?.setLead) {
    await Opportunity0.setLead(relatedLead0);
  }

  const relatedLead1 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Opportunity1 = await Opportunities.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Opportunity1?.setLead) {
    await Opportunity1.setLead(relatedLead1);
  }

  const relatedLead2 = await Leads.findOne({
    offset: Math.floor(Math.random() * (await Leads.count())),
  });
  const Opportunity2 = await Opportunities.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Opportunity2?.setLead) {
    await Opportunity2.setLead(relatedLead2);
  }
}

async function associateOpportunityWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Opportunity0 = await Opportunities.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Opportunity0?.setOrganization) {
    await Opportunity0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Opportunity1 = await Opportunities.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Opportunity1?.setOrganization) {
    await Opportunity1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Opportunity2 = await Opportunities.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Opportunity2?.setOrganization) {
    await Opportunity2.setOrganization(relatedOrganization2);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Contacts.bulkCreate(ContactsData);

    await CustomerInteractions.bulkCreate(CustomerInteractionsData);

    await Leads.bulkCreate(LeadsData);

    await Opportunities.bulkCreate(OpportunitiesData);

    await Organizations.bulkCreate(OrganizationsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateUserWithOrganization(),

      await associateContactWithOrganization(),

      await associateCustomerInteractionWithContact(),

      await associateCustomerInteractionWithUser(),

      await associateCustomerInteractionWithOrganization(),

      await associateLeadWithOwner(),

      // Similar logic for "relation_many"

      await associateLeadWithOrganization(),

      await associateOpportunityWithLead(),

      await associateOpportunityWithOrganization(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('contacts', null, {});

    await queryInterface.bulkDelete('customer_interactions', null, {});

    await queryInterface.bulkDelete('leads', null, {});

    await queryInterface.bulkDelete('opportunities', null, {});

    await queryInterface.bulkDelete('organizations', null, {});
  },
};
