import {NextFunction, Request, Response} from "express";
import {Name} from "../entity/Name";
import {getRepository} from "typeorm";
import {AppDataSource} from "../data-source";

interface returnedName {
  id: string
  firstName: string
  lastName: string
  updateAt: Date
}

export class NameController {
  static async test (request: Request, response: Response, next: NextFunction) {
    response.send('this is test');
  }

  static async add (request: Request, response: Response, next: NextFunction) {
    let {firstName, lastName} = request.body;

    try {
      let newName = await Name
        .create({
          firstName,
          lastName,
        })
        .save();

      let returnedName: returnedName = {
        id: newName.id,
        firstName: newName.firstName,
        lastName: newName.lastName,
        updateAt: newName.updateAt,
      }

      response.status(201).send({rs: true, data: returnedName});

    } catch (e) {
      response.status(401).send({rs: false, message: e.message});
    }
  }

  static async update(request: Request, response: Response, next: NextFunction) {
    let {id} = request.params
    let {firstName, lastName} = request.body;

    try {
      let name = await Name.findOneOrFail({where: {id}})

      if (name) {
        name.firstName = firstName;
        name.lastName = lastName;
        await name.save();

        let returnedName: returnedName = {
          id: name.id,
          firstName: name.firstName,
          lastName: name.lastName,
          updateAt: name.updateAt,
        }

        response.status(200).send({rs: true, data: returnedName});
      }
    } catch (e) {
      response.status(400).send({rs: false, message: e.message});
    }
  }

  static async get(request: Request, response: Response, next: NextFunction) {
    let {id} = request.params;

    try {
      let name = await Name.findOneOrFail({
        select: ['firstName', 'lastName', 'id', 'updateAt'],
        where: {id},
      });

      response.status(200).send({rs: true, data: name});
    } catch (e) {
      response.status(404).send({rs: false, message: e.message});
    }
  }

  static async getNameByPage(request: Request, response: Response, next: NextFunction) {
    const {beforeCursor, afterCursor} = request.body;

    const baseQuery = AppDataSource.getRepository(Name)
      .createQueryBuilder('name')
      .select(['name.id', 'name.firstName', 'name.lastName', 'name.updateAt'])
      .where('name.isDelete=0')
      .orderBy('name.id', 'ASC')

    const cursorQuery = baseQuery.clone();
    if (beforeCursor) {
      cursorQuery.andWhere('name.id < :cursor', {cursor: beforeCursor});
    } else if (afterCursor) {
      cursorQuery.andWhere('name.id > :cursor', {cursor: afterCursor});
    }

    try {
      // get result
      const names = await cursorQuery
        .take(10)
        .getMany();

      // check if there is any record before these 10 names
      const beforeQuery = baseQuery.clone();
      let countBefore = await beforeQuery.andWhere('name.id < :cursor', {cursor: names[0].id}).getCount();
      let beforeCursorToFront = countBefore > 0 ? names[0].id : null;

      // check if there is any record after these 10 names
      const afterQuery = baseQuery.clone();
      let countAfter = await afterQuery.andWhere('name.id > :cursor', {cursor: names[names.length-1].id}).getCount();
      let afterCursorToFront = countAfter > 0 ? names[names.length-1].id : null;

      response.status(200).send({
        rs: true,
        data: {
          results: names,
          beforeCursor: beforeCursorToFront,
          afterCursor: afterCursorToFront
        }
      })

    } catch (e) {
      response.status(400).send({rs: false, message: e.message})
    }
  }

  static async getAll(request: Request, response: Response, next: NextFunction) {
    const {page, perPage} = request.query
    try {
      let names = await Name.find({
        select: ['firstName', 'lastName', 'id', 'updateAt'],
        where: {isDelete: false},
      })

      // offset pagination
      const nameRepo = AppDataSource.getRepository(Name);
      let [pageNames, total] = await nameRepo
        .createQueryBuilder('name')
        .where('name.isDelete=0')
        .skip((Number(page)-1) * Number(perPage))
        .take(Number(perPage))
        .getManyAndCount()

      response.status(200).send({
        rs: true,
        data: {
          results: pageNames,
          total,
        },
      });
    } catch (e) {
      response.status(400).send({rs: false, message: e.message});
    }
  }

  static async delete(request: Request, response: Response, next: NextFunction) {
    let {id} = request.params

    try {
      let name = await Name.findOneOrFail({where: {id}});

      if (name) {
        name.isDelete = true;
        name.isActive = false;

        await name.save();
        response.status(200).send({rs: true, data: name});
      }
    } catch (e) {
      response.status(400).send({rs: false, message: e.message});
    }
  }
}