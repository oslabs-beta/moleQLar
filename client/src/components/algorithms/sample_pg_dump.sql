
CREATE TABLE public.people (
	"_id" serial NOT NULL,
	"name" varchar NOT NULL,
	"mass" varchar,
	"hair_color" varchar,
	"skin_color" varchar,
	"eye_color" varchar,
	"birth_year" varchar,
	"gender" varchar,
	"species_id" bigint,
	"homeworld_id" bigint,
	"height" integer,
	CONSTRAINT "people_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.films (
	"_id" serial NOT NULL,
	"title" varchar NOT NULL,
	"episode_id" integer NOT NULL,
	"opening_crawl" varchar NOT NULL,
	"director" varchar NOT NULL,
	"producer" varchar NOT NULL,
	"release_date" DATE NOT NULL,
	CONSTRAINT "films_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.people_in_films (
	"_id" serial NOT NULL,
	"person_id" bigint NOT NULL,
	"film_id" bigint NOT NULL,
	CONSTRAINT "people_in_films_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.planets (
	"_id" serial NOT NULL,
	"name" varchar,
	"rotation_period" integer,
	"orbital_period" integer,
	"diameter" integer,
	"climate" varchar,
	"gravity" varchar,
	"terrain" varchar,
	"surface_water" varchar,
	"population" bigint,
	CONSTRAINT "planets_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.species (
	"_id" serial NOT NULL,
	"name" varchar NOT NULL,
	"classification" varchar,
	"average_height" varchar,
	"average_lifespan" varchar,
	"hair_colors" varchar,
	"skin_colors" varchar,
	"eye_colors" varchar,
	"language" varchar,
	"homeworld_id" bigint,
	CONSTRAINT "species_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.vessels (
	"_id" serial NOT NULL,
	"name" varchar NOT NULL,
	"manufacturer" varchar,
	"model" varchar,
	"vessel_type" varchar NOT NULL,
	"vessel_class" varchar NOT NULL,
	"cost_in_credits" bigint,
	"length" varchar,
	"max_atmosphering_speed" varchar,
	"crew" integer,
	"passengers" integer,
	"cargo_capacity" varchar,
	"consumables" varchar,
	CONSTRAINT "vessels_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.species_in_films (
	"_id" serial NOT NULL,
	"film_id" bigint NOT NULL,
	"species_id" bigint NOT NULL,
	CONSTRAINT "species_in_films_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.planets_in_films (
	"_id" serial NOT NULL,
	"film_id" bigint NOT NULL,
	"planet_id" bigint NOT NULL,
	CONSTRAINT "planets_in_films_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.pilots (
	"_id" serial NOT NULL,
	"person_id" bigint NOT NULL,
	"vessel_id" bigint NOT NULL,
	CONSTRAINT "pilots_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.vessels_in_films (
	"_id" serial NOT NULL,
	"vessel_id" bigint NOT NULL,
	"film_id" bigint NOT NULL,
	CONSTRAINT "vessels_in_films_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE public.starship_specs (
	"_id" serial NOT NULL,
	"hyperdrive_rating" varchar,
	"MGLT" varchar,
	"vessel_id" bigint NOT NULL,
	CONSTRAINT "starship_specs_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE public.people ADD CONSTRAINT "people_fk0" FOREIGN KEY ("species_id") REFERENCES public.species("_id");
ALTER TABLE public.people ADD CONSTRAINT "people_fk1" FOREIGN KEY ("homeworld_id") REFERENCES public.planets("_id");


ALTER TABLE public.people_in_films ADD CONSTRAINT "people_in_films_fk0" FOREIGN KEY ("person_id") REFERENCES public.people("_id");
ALTER TABLE public.people_in_films ADD CONSTRAINT "people_in_films_fk1" FOREIGN KEY ("film_id") REFERENCES public.films("_id");


ALTER TABLE public.species ADD CONSTRAINT "species_fk0" FOREIGN KEY ("homeworld_id") REFERENCES public.planets("_id");


ALTER TABLE public.species_in_films ADD CONSTRAINT "species_in_films_fk0" FOREIGN KEY ("film_id") REFERENCES public.films("_id");
ALTER TABLE public.species_in_films ADD CONSTRAINT "species_in_films_fk1" FOREIGN KEY ("species_id") REFERENCES public.species("_id");

ALTER TABLE public.planets_in_films ADD CONSTRAINT "planets_in_films_fk0" FOREIGN KEY ("film_id") REFERENCES public.films("_id");
ALTER TABLE public.planets_in_films ADD CONSTRAINT "planets_in_films_fk1" FOREIGN KEY ("planet_id") REFERENCES public.planets("_id");

ALTER TABLE public.pilots ADD CONSTRAINT "pilots_fk0" FOREIGN KEY ("person_id") REFERENCES public.people("_id");
ALTER TABLE public.pilots ADD CONSTRAINT "pilots_fk1" FOREIGN KEY ("vessel_id") REFERENCES public.vessels("_id");

ALTER TABLE public.vessels_in_films ADD CONSTRAINT "vessels_in_films_fk0" FOREIGN KEY ("vessel_id") REFERENCES public.vessels("_id");
ALTER TABLE public.vessels_in_films ADD CONSTRAINT "vessels_in_films_fk1" FOREIGN KEY ("film_id") REFERENCES public.films("_id");

ALTER TABLE public.starship_specs ADD CONSTRAINT "starship_specs_fk0" FOREIGN KEY ("vessel_id") REFERENCES public.vessels("_id");

