SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped the 10/11/2024 at 18:06:00
-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'b75c9387-3d0d-4bfe-9450-94268174c9d7', 'authenticated', 'authenticated', 'admin@mocap.fr', '$2a$10$Qm3rAN.ILvEyfynmaIl2kuB.tWI57C5oXKX03bEy.f2EB4hh7h9I6', '2024-11-03 21:16:32.954453+00', NULL, '', '2024-11-03 21:16:20.732506+00', 'pkce_6f4048a1afac7d1f80ceefd8c14f260ac1e2313b17ca3371a2855cc5', '2024-11-05 17:16:31.937668+00', '', '', NULL, '2024-11-05 17:16:52.632214+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "b75c9387-3d0d-4bfe-9450-94268174c9d7", "role": "superadmin", "email": "admin@mocap.fr", "isInit": true, "status": "ACTV", "preferences": {}, "email_verified": false, "phone_verified": false}', NULL, '2024-11-03 21:16:20.681452+00', '2024-11-05 18:36:59.764644+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('b75c9387-3d0d-4bfe-9450-94268174c9d7', 'b75c9387-3d0d-4bfe-9450-94268174c9d7', '{"sub": "b75c9387-3d0d-4bfe-9450-94268174c9d7", "role": "user", "email": "admin@mocap.fr", "isInit": true, "status": "RQST", "preferences": {}, "email_verified": false, "phone_verified": false}', 'email', '2024-11-03 21:16:20.706501+00', '2024-11-03 21:16:20.706567+00', '2024-11-03 21:16:20.706567+00', 'a83bef67-c2f5-4b3f-a838-408f1898a79f');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: Artist; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: Available_Languages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."Available_Languages" ("id", "name") VALUES
	(1, 'fr'),
	(2, 'en');


--
-- Data for Name: CTA_Link; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: Medias_Controls; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: Medias; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: Bricks_Album; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: Platform; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: Platform_Link; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: Bricks_Album_Platform_Link; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: Track; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: Bricks_Album_Track; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: Bricks_HeroSection; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: Bricks_Single; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: Bricks_Single_Platform_Link; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: Bricks_Text; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: Mail_Pairing; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: Media_Adjustement; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."Media_Adjustement" ("id", "name") VALUES
	(1, 'cover'),
	(2, 'contain');


--
-- Data for Name: Node; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: Settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

--
-- Data for Name: Track_Artist; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: Track_Platform_Link; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: base_brick; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('Images', 'Images', NULL, '2024-01-15 08:15:45.528727+00', '2024-01-15 08:15:45.528727+00', true, false, NULL, '{image/jpeg,image/png,image/gif,image/webp,image/tiff,image/svg+xml}', NULL),
	('Videos', 'Videos', NULL, '2024-01-15 08:16:30.316523+00', '2024-01-15 08:16:30.316523+00', true, false, NULL, '{video/mp4,video/mpeg,video/ogg,video/webm,video/avi}', NULL),
	('Audios', 'Audios', NULL, '2024-01-15 08:17:49.256866+00', '2024-01-15 08:17:49.256866+00', true, false, NULL, '{audio/mpeg,audio/wav,audio/ogg,audio/webm,audio/aac,audio/flac}', NULL),
	('Misc', 'Misc', NULL, '2024-01-15 08:17:56.206558+00', '2024-01-15 08:17:56.206558+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 262, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: Audio_Controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Audio_Controls_id_seq"', 1, true);


--
-- Name: Audio_Link_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Audio_Link_id_seq"', 3, true);


--
-- Name: Available_Languages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Available_Languages_id_seq"', 2, true);


--
-- Name: Bricks_HeroSection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Bricks_HeroSection_id_seq"', 1, true);


--
-- Name: Bricks_Single_duplicate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Bricks_Single_duplicate_id_seq"', 17, true);


--
-- Name: Bricks_Single_duplicate_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Bricks_Single_duplicate_id_seq1"', 6, true);


--
-- Name: Bricks_Single_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Bricks_Single_id_seq"', 2, true);


--
-- Name: Mail_Pairing_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Mail_Pairing_id_seq"', 7, true);


--
-- Name: Media_Adjustement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Media_Adjustement_id_seq"', 2, true);


--
-- Name: Platform_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Platform_id_seq"', 8, true);


--
-- Name: Settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Settings_id_seq"', 1, false);


--
-- Name: base_brick_duplicate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."base_brick_duplicate_id_seq"', 10, true);


--
-- Name: base_brick_duplicate_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."base_brick_duplicate_id_seq1"', 2, true);


--
-- Name: base_brick_duplicate_id_seq2; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."base_brick_duplicate_id_seq2"', 33, true);


--
-- Name: base_brick_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."base_brick_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
