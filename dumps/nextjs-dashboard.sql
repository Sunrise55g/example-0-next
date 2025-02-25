--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: invoices; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.invoices (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    amount integer NOT NULL,
    status character varying(255) NOT NULL,
    date date NOT NULL
);


ALTER TABLE public.invoices OWNER TO root;

--
-- Name: revenue; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.revenue (
    month character varying(4) NOT NULL,
    revenue integer NOT NULL
);


ALTER TABLE public.revenue OWNER TO root;

--
-- Name: users; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    email text NOT NULL,
    image_url character varying(255) NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.users OWNER TO root;

--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.invoices (id, user_id, amount, status, date) FROM stdin;
058687cc-9acb-4510-8995-6e3fce60e9ea	410544b2-4001-4271-9855-fec4b6a6442a	15795	pending	2022-12-06
c32f15bd-0ea3-4120-91d7-df50ccabccac	d6e15727-9fe1-4961-8c5b-ea44a9bd81aa	20348	pending	2022-11-14
d15ebdd9-c1da-42b9-8e2b-a0d163840daf	76d65c26-f784-44a2-ac19-586678f7c2f2	1250	paid	2023-06-17
68d20866-bce0-409b-b50a-c12d8ad523ad	cc27c14a-0acf-4f4a-a6c9-d45682c144b9	8546	paid	2023-06-07
e3cc32dc-da30-4ad7-b647-84c1ff29ce7f	d6e15727-9fe1-4961-8c5b-ea44a9bd81aa	500	paid	2023-08-19
90b784e1-88b9-48cc-91e6-0513844c99e6	cc27c14a-0acf-4f4a-a6c9-d45682c144b9	8945	paid	2023-06-03
24186625-2ebd-4665-bef0-ad9044d28147	3958dc9e-712f-4377-85e9-fec4b6a6442a	1000	paid	2022-06-05
67f64e73-4f70-4ebf-b9ef-ea0cf56980ec	3958dc9e-742f-4377-85e9-fec4b6a6442a	32545	paid	2023-06-09
15a77d33-a1d9-40a1-ad24-e87b36f37451	410544b2-4001-4271-9855-fec4b6a6442a	666	pending	2023-06-27
4686a38a-9455-4d7f-83e0-5160e983395f	3958dc9e-742f-4377-85e9-fec4b6a6442a	44800	paid	2023-09-10
f2836c89-c702-4775-963d-b6f7f05135c2	3958dc9e-712f-4377-85e9-fec4b6a6442a	54246	pending	2023-07-16
224f7cd0-3bbe-4b92-9653-8ab5fe6bea7d	76d65c26-f784-44a2-ac19-586678f7c2f2	3040	paid	2022-10-29
1b63a0b7-f8a2-407e-90eb-e6cc5f4dfc91	cc27c14a-0acf-4f4a-a6c9-d45682c144b9	34577	pending	2023-08-05
\.


--
-- Data for Name: revenue; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.revenue (month, revenue) FROM stdin;
Jan	2000
Feb	1800
Apr	2500
Jul	3500
Mar	2200
May	2300
Aug	3700
Sep	2500
Jun	3200
Oct	2800
Nov	3000
Dec	4800
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.users (id, name, email, image_url, password) FROM stdin;
3958dc9e-712f-4377-85e9-fec4b6a6442a	Delba de Oliveira	delba@oliveira.com	/users/delba-de-oliveira.png	$2b$10$qqNA6fU.NIwuTwaKgTOwjOPRjYMBHORAOXJa4XWsrCtisG3yjF.Ti
13d07535-c59e-4157-a011-f8d2ef4e0cbb	Balazs Orban	balazs@orban.com	/users/balazs-orban.png	$2b$10$kn74jSEzHrePrhiBYuqnkeIfhjiAAI77hMXQ9nvDpC3eX9J5p2VTC
d6e15727-9fe1-4961-8c5b-ea44a9bd81aa	Evil Rabbit	evil@rabbit.com	/users/evil-rabbit.png	$2b$10$4NoTfrzbX6j/o9/H.sE5lOiJaCg6Gwz43.97BQuSn3t9GjopYQ1Lm
76d65c26-f784-44a2-ac19-586678f7c2f2	Michael Novotny	michael@novotny.com	/users/michael-novotny.png	$2b$10$RiiVS7IHXIq3ZyU.wJRbUeCjKaPAdqQdsZ6tBJSXsQwzsHFSCFiPW
410544b2-4001-4271-9855-fec4b6a6442a	User	user@nextmail.com	/users/evil-rabbit.png	$2b$10$odVjut2ufRU0lz7i/iaeLevroB6noMNPvGPVN64zj1X4tnVgu6CV2
cc27c14a-0acf-4f4a-a6c9-d45682c144b9	Amy Burns	amy@burns.com	/users/amy-burns.png	$2b$10$mw4mieVFBXrPQk2jMnFrQOwZR1TOwD0n2OZrnWGOzR4tHMgJaHjbO
3958dc9e-742f-4377-85e9-fec4b6a6442a	Lee Robinson	lee@robinson.com	/users/lee-robinson.png	$2b$10$P9LK/bRkHXdrr7yEQiNKhe2vJFHg1JBLxzL24Hj1tChscqNtF2VIC
\.


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: revenue revenue_month_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.revenue
    ADD CONSTRAINT revenue_month_key UNIQUE (month);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

