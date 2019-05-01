
exports.up = function(knex, Promise) {
return knex.schema.createTable('students', tbl=> {
    
        tbl.increments()

        tbl.string('name', 255).notNullable()

        tbl
            .integer('cohorts_id')
            .unsigned()
            .references('id')
            .inTable('cohorts')
            .onDelete('CASCADE')
            .onUpdated('CASCADE')
    
        tbl.timestamps(true, true)
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('students')
};
