/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_327047008")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_STVeAqFzMK` ON `tracks` (\n  `user`,\n  `name`\n)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_327047008")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_STVeAqFzMK` ON `tracks` (\n  `user`,\n  `name`\n)"
    ]
  }, collection)

  return app.save(collection)
})
