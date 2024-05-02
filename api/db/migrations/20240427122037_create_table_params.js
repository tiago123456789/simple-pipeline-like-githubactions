/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTableIfNotExists("params", table => {
      table.bigIncrements('id').primary()
      table.varchar("name", 255)
      table.varchar("value")
      table.bigInteger("task_id")
      table.foreign("task_id").references("tasks.id")
      table.timestamps(true, true)
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists("params")
  };
  