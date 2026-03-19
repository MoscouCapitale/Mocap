/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_54894089")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = user"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_54894089")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = user.id"
  }, collection)

  return app.save(collection)
})
