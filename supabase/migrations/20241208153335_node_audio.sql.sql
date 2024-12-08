alter table "public"."Bricks_Audio" drop column "link";

alter table "public"."Node" add column "Audio" bigint;

alter table "public"."Node" add constraint "Node_Audio_fkey" FOREIGN KEY ("Audio") REFERENCES "Bricks_Audio"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Node" validate constraint "Node_Audio_fkey";


