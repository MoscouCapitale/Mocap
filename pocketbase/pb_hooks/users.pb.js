/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/api/user/email/{email}", (e) => {
  let email = e.request.pathValue("email");
  try {
      // If user does not exists (throws error), return 204
    $app.findFirstRecordByData("users", "email", email);
    return e.json(200);
  } catch {
    return e.json(204);
  }
});