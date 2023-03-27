
exports.seed = function(knex, Promise) { //eslint-disable-line
  // Deletes ALL existing entries
  return knex('groceries').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('groceries').insert([
        {id: 1, name: 'eggs'},
        {id: 2, name: 'milk'},
        {id: 3, name: 'bread'}
      ]);
    });
};
