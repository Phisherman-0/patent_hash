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

DROP INDEX IF EXISTS public."IDX_session_expire";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_unique;
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY public.prior_art_results DROP CONSTRAINT IF EXISTS prior_art_results_pkey;
ALTER TABLE IF EXISTS ONLY public.patents DROP CONSTRAINT IF EXISTS patents_pkey;
ALTER TABLE IF EXISTS ONLY public.patent_documents DROP CONSTRAINT IF EXISTS patent_documents_pkey;
ALTER TABLE IF EXISTS ONLY public.patent_activity DROP CONSTRAINT IF EXISTS patent_activity_pkey;
ALTER TABLE IF EXISTS ONLY public.blockchain_transactions DROP CONSTRAINT IF EXISTS blockchain_transactions_pkey;
ALTER TABLE IF EXISTS ONLY public.ai_analysis DROP CONSTRAINT IF EXISTS ai_analysis_pkey;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.sessions;
DROP TABLE IF EXISTS public.prior_art_results;
DROP TABLE IF EXISTS public.patents;
DROP TABLE IF EXISTS public.patent_documents;
DROP TABLE IF EXISTS public.patent_activity;
DROP TABLE IF EXISTS public.blockchain_transactions;
DROP TABLE IF EXISTS public.ai_analysis;
DROP TYPE IF EXISTS public.patent_status;
DROP TYPE IF EXISTS public.patent_category;
--
-- Name: patent_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.patent_category AS ENUM (
    'medical_technology',
    'software_ai',
    'renewable_energy',
    'manufacturing',
    'biotechnology',
    'automotive',
    'telecommunications',
    'other'
);


--
-- Name: patent_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.patent_status AS ENUM (
    'draft',
    'pending',
    'under_review',
    'approved',
    'rejected',
    'expired'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ai_analysis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_analysis (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    patent_id character varying NOT NULL,
    analysis_type character varying NOT NULL,
    result jsonb NOT NULL,
    confidence numeric(5,4),
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: blockchain_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blockchain_transactions (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    patent_id character varying NOT NULL,
    transaction_type character varying NOT NULL,
    hedera_transaction_id character varying,
    hedera_topic_id character varying,
    hedera_message_id character varying,
    gas_used numeric(10,6),
    status character varying DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: patent_activity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patent_activity (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    patent_id character varying NOT NULL,
    user_id character varying NOT NULL,
    activity_type character varying NOT NULL,
    description text,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: patent_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patent_documents (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    patent_id character varying NOT NULL,
    file_name character varying NOT NULL,
    file_path character varying NOT NULL,
    file_type character varying NOT NULL,
    file_size integer NOT NULL,
    hash_value character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: patents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patents (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying NOT NULL,
    title character varying NOT NULL,
    description text NOT NULL,
    category public.patent_category NOT NULL,
    status public.patent_status DEFAULT 'draft'::public.patent_status,
    patent_number character varying,
    file_path character varying,
    hash_value character varying,
    hedera_topic_id character varying,
    hedera_message_id character varying,
    hedera_nft_id character varying,
    estimated_value numeric(12,2),
    filed_at timestamp without time zone,
    approved_at timestamp without time zone,
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: prior_art_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.prior_art_results (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    patent_id character varying NOT NULL,
    similar_patent_id character varying,
    external_patent_id character varying,
    similarity_score numeric(5,4),
    title character varying,
    description text,
    source character varying,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id character varying DEFAULT gen_random_uuid() NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    profile_image_url character varying,
    role character varying DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Data for Name: ai_analysis; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ai_analysis (id, patent_id, analysis_type, result, confidence, created_at) FROM stdin;
\.


--
-- Data for Name: blockchain_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blockchain_transactions (id, patent_id, transaction_type, hedera_transaction_id, hedera_topic_id, hedera_message_id, gas_used, status, created_at) FROM stdin;
\.


--
-- Data for Name: patent_activity; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.patent_activity (id, patent_id, user_id, activity_type, description, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: patent_documents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.patent_documents (id, patent_id, file_name, file_path, file_type, file_size, hash_value, created_at) FROM stdin;
\.


--
-- Data for Name: patents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.patents (id, user_id, title, description, category, status, patent_number, file_path, hash_value, hedera_topic_id, hedera_message_id, hedera_nft_id, estimated_value, filed_at, approved_at, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: prior_art_results; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.prior_art_results (id, patent_id, similar_patent_id, external_patent_id, similarity_score, title, description, source, created_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (sid, sess, expire) FROM stdin;
hHE82nhts5KEGhPdwMTAEmEfMb5K6aqC	{"cookie": {"path": "/", "secure": false, "expires": "2025-08-20T18:00:22.456Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"claims": {"aud": "fb24487a-c883-41b2-a8ef-bc10dff73a7d", "exp": 1755111622, "iat": 1755108022, "iss": "https://replit.com/oidc", "sub": "25512469", "email": "infernospyder@gmail.com", "at_hash": "SS6JVGdAV4KnAsyqlR90OQ", "username": "ElemejeAyomide", "auth_time": 1755108021, "last_name": "Ayomide", "first_name": "Elemeje"}, "expires_at": 1755111622, "access_token": "LMZvxnhjND4cW6-FoPY64LB_nN-N4P0yeab2M78M7wf", "refresh_token": "DUrBq7au87lUwnGGzZ9cpbfPfg-i5efvyi10zMht-s8"}}}	2025-08-20 18:13:35
h8PD-Q0HVMz8nzXgMItXJenzd8xKJgsP	{"cookie": {"path": "/", "secure": false, "expires": "2025-08-20T19:33:29.397Z", "httpOnly": true, "originalMaxAge": 604800000}, "passport": {"user": {"claims": {"aud": "fb24487a-c883-41b2-a8ef-bc10dff73a7d", "exp": 1755117209, "iat": 1755113609, "iss": "https://replit.com/oidc", "sub": "25512469", "email": "infernospyder@gmail.com", "at_hash": "DOilmTvJR1deF7S7h4-Tpg", "username": "ElemejeAyomide", "auth_time": 1755113608, "last_name": "Ayomide", "first_name": "Elemeje"}, "expires_at": 1755117209, "access_token": "E11_Mebk390LFaM15zztrkOk4pyzgNkWMwD03Jl58jz", "refresh_token": "b2RZ3pbC8S8SiXd3OZF1S7--yms1_LIGWpimtBVnhrA"}}}	2025-08-20 19:52:51
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, first_name, last_name, profile_image_url, role, created_at, updated_at) FROM stdin;
25512469	infernospyder@gmail.com	Elemeje	Ayomide	\N	user	2025-08-13 18:00:22.343235	2025-08-13 19:33:29.135
\.


--
-- Name: ai_analysis ai_analysis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_analysis
    ADD CONSTRAINT ai_analysis_pkey PRIMARY KEY (id);


--
-- Name: blockchain_transactions blockchain_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blockchain_transactions
    ADD CONSTRAINT blockchain_transactions_pkey PRIMARY KEY (id);


--
-- Name: patent_activity patent_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patent_activity
    ADD CONSTRAINT patent_activity_pkey PRIMARY KEY (id);


--
-- Name: patent_documents patent_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patent_documents
    ADD CONSTRAINT patent_documents_pkey PRIMARY KEY (id);


--
-- Name: patents patents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patents
    ADD CONSTRAINT patents_pkey PRIMARY KEY (id);


--
-- Name: prior_art_results prior_art_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prior_art_results
    ADD CONSTRAINT prior_art_results_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- PostgreSQL database dump complete
--

