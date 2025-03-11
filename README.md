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

- [X] It should be possible to CRUD a pet
- [X] It should be possible to list all pets available for adoption in a Organization
- [X] It should be possible to list all pets available for adoption in a City
- [X] It should be possible to filter pets by their characteristics
- [ ] It should be possible to view details of a pet for adoption (name, photo, description, age, breed)
- [X] It should be possible to CRUD an ORG
- [ ] It should be possible to log in and log out as an ORG
- [ ] It should be possible to edit the organization only if the organization is logged in
- [ ] It should be possible to edit the pet only if the organization is logged in
- [X] It should be possible to add photos to a Pet
<!-- - [ ] It should not be possible delete a register, only deactivate it -->
<!-- - [ ] It should be possible to processs Pet photo to webp through RBMQ system -->

## Business Rules

- [ ] To list the pets, it is mandatory to inform the city or get automatically throguh navigator coordinates
- [ ] It should be possible to flag the pet as adopted as an ORG
- [ ] The pet flagged as adopted should not be displayed on the list but can be accessed
- [X] An ORG needs to have an address and a WhatsApp number (name, address, phone, cpnj)
- [ ] It should be possible to list all ORG pets (That aren't flagged as adopted)
- [X] A pet must be linked to an ORG
- [ ] The user who wants to adopt will contact the ORG via WhatsApp  
- [ ] All filters, except for the city, are optional
- [ ] For an ORG to access the application as an admin, it needs to be logged in
- [ ] It should be possible to have a loggin session as an ORG
- [ ] Only pets with profile photos can be displayed

## TODO

- [ ] Add a way to delete a pet
- [ ] Add a way to delete a photo
- [ ] Add a way to delete a pet photo
- [ ] Add a way to delete an ORG pet
- [ ] Add a way to delete a pet photo
- [ ] Add a way to update a pet register
- [ ] Pass utils files to services
- [ ] Create a logger mock for tests
