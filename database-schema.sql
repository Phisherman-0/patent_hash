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

