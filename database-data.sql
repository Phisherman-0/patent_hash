--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

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
-- Data for Name: ai_analysis; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: blockchain_transactions; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: patent_activity; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: patent_documents; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: patents; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: prior_art_results; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sessions VALUES ('hHE82nhts5KEGhPdwMTAEmEfMb5K6aqC', '{"cookie": {"path": "/", "secure": false, "expires": "2025-08-20T18:00:22.456Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"claims": {"aud": "fb24487a-c883-41b2-a8ef-bc10dff73a7d", "exp": 1755111622, "iat": 1755108022, "iss": "https://replit.com/oidc", "sub": "25512469", "email": "infernospyder@gmail.com", "at_hash": "SS6JVGdAV4KnAsyqlR90OQ", "username": "ElemejeAyomide", "auth_time": 1755108021, "last_name": "Ayomide", "first_name": "Elemeje"}, "expires_at": 1755111622, "access_token": "LMZvxnhjND4cW6-FoPY64LB_nN-N4P0yeab2M78M7wf", "refresh_token": "DUrBq7au87lUwnGGzZ9cpbfPfg-i5efvyi10zMht-s8"}}}', '2025-08-20 18:13:35');
INSERT INTO public.sessions VALUES ('h8PD-Q0HVMz8nzXgMItXJenzd8xKJgsP', '{"cookie": {"path": "/", "secure": false, "expires": "2025-08-20T19:33:29.397Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"claims": {"aud": "fb24487a-c883-41b2-a8ef-bc10dff73a7d", "exp": 1755117209, "iat": 1755113609, "iss": "https://replit.com/oidc", "sub": "25512469", "email": "infernospyder@gmail.com", "at_hash": "DOilmTvJR1deF7S7h4-Tpg", "username": "ElemejeAyomide", "auth_time": 1755113608, "last_name": "Ayomide", "first_name": "Elemeje"}, "expires_at": 1755117209, "access_token": "E11_Mebk390LFaM15zztrkOk4pyzgNkWMwD03Jl58jz", "refresh_token": "b2RZ3pbC8S8SiXd3OZF1S7--yms1_LIGWpimtBVnhrA"}}}', '2025-08-20 19:52:46');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES ('25512469', 'infernospyder@gmail.com', 'Elemeje', 'Ayomide', NULL, 'user', '2025-08-13 18:00:22.343235', '2025-08-13 19:33:29.135');


--
-- PostgreSQL database dump complete
--

