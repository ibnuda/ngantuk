create extension pgcrypto;

create table roles(name varchar(255) not null primary key);

create table users(
    username varchar(255) not null primary key,
    password varchar(255) not null,
    commentary varchar(255)
    -- roleRolename varchar(255),
    -- constraint fk_role foreign key (roleRolename) references roles(rolename)
);

insert into
    roles
values
    ('admin'),
    ('normie');

-- insert into
--     users
-- values
--     (
--         'admin',
--         crypt('masuk', gen_salt('bf', 10)),
--         'ini admin'
--         -- (
--         --     select
--         --         rolename
--         --     from
--         --         roles
--         --     where
--         --         rolename = 'admin'
--         -- )
--     );