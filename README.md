# Find A Friend API

## API Docs from Swagger

`localhost:{3333 or 3000}/docs`

## To start application

- Feel free to use your favorite *pack manager*

```cmd
yarn

yarn dev
```

## Set up docker

- You must also set *docker* environment up
  - Don't forget to configure it to your own way

```cmd
docker compose up --build
````

## Application Rules

- [ ] It should be possible to register a pet
- [ ] It should be possible to update a specific pet register
- [ ] It should be possible to list all pets available for adoption in a Org
- [ ] It should be possible to list all pets available for adoption in a City
- [ ] It should be possible to filter pets by their characteristics
- [ ] It should be possible to view details of a pet for adoption (name, photo, description, age, breed)
- [ ] It should be possible to register as an ORG
- [ ] It should be possible to log in and log out as an ORG

## Business Rules

- [ ] To list the pets, it is mandatory to inform the city or get automatically throguh navigator coordinates
- [ ] It should be possible to flag the pet as adopted
- [ ] The pet flagged as adopted should not be displayed on the list but can be accessed
- [ ] An ORG needs to have an address and a WhatsApp number (name, address, phone, cpnj)
- [ ] It should be possible to list all ORG pets
- [ ] A pet must be linked to an ORG
- [ ] The user who wants to adopt will contact the ORG via WhatsApp  
- [ ] All filters, except for the city, are optional
- [ ] For an ORG to access the application as an admin, it needs to be logged in
