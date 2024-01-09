import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspacesModel } from './entities/workspaces.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { ListsModel } from 'src/lists/entities/lists.entity';
import { UsersModel } from 'src/users/entities/users.entity';
import { MembersDto } from './dto/invite-member.dto';

@Injectable()
export class WorkspacesService {
    constructor(
        @InjectRepository(WorkspacesModel)
        private workspaceRepository: Repository<WorkspacesModel>,

        @InjectRepository(UsersModel)
        private userRepository: Repository<UsersModel>,

        private readonly dataSource: DataSource,
      ) {}
    
      /**
       * 워크스페이스 생성
       * 
       */
      async createWorkspace(userId:number,createworkspaceDto:CreateWorkspaceDto) {

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{

          const workspace = this.workspaceRepository.create({
            name:createworkspaceDto.name,
            description:createworkspaceDto.description,
            color:createworkspaceDto.color,
            ownerId:userId
          });

          // workspace 정보 저장
          await queryRunner.manager.save(WorkspacesModel,workspace);

          const newWorkSapceId = await queryRunner.manager
          .createQueryBuilder()
          .select([
            'MAX(workspaces_model.id) AS max_id',
          ])
          .from(WorkspacesModel, 'workspaces_model')
          .where('workspaces_model.ownerId = :userId', { userId })
          .getRawMany();

          // users_model_workspaces_workspaces_model에도 멤버 정보 저장
          await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into('users_model_workspaces_workspaces_model')
          .values(
              {
                usersModelId:userId,
                workspacesModelId:newWorkSapceId[0].max_id
              }
            )
          .execute();

          await queryRunner.commitTransaction();

          return {
            "message":"워크스페이스를 생성했습니다.",
            "data": workspace
          }

        }catch(error){

          await queryRunner.rollbackTransaction();
          console.log(`error : ${error}`)
          if (error instanceof HttpException) {
            // HttpException을 상속한 경우(statusCode 속성이 있는 경우)
            throw error;
          } else {
            // 그 외의 예외
            throw new InternalServerErrorException('서버 에러가 발생했습니다.');
          }

        }finally{
          await queryRunner.release();
        }
    
    }

    /**
     * 워크스페이스 조회
     * 
     */
    async findAllWorkspace(userId:number) {
        const workspaces = await this.workspaceRepository.find({
            select:['id','name'],
            where: {
              ownerId: userId, 
            },
        });
      
        return {
          "message":"워크스페이스를 조회했습니다.",
          "data":workspaces
        }
    }

    /**
     * 워크스페이스 수정
     * 
     */
    async updateWorkspace(userId:number,workspaceId: number, createworkspaceDto:CreateWorkspaceDto) {

      await this.isOwner(userId,workspaceId);

        const workspace = await this.verifyWorkSpaceById(workspaceId);
      
          await this.workspaceRepository.update({ id:workspaceId }, 
            {
                name:createworkspaceDto.name,
                description: createworkspaceDto.description,
                color:createworkspaceDto.color
            });
      
          return {
            "message": "워크스페이스 정보를 수정했습니다."
          }

    }

    /**
     * 워크스페이스 삭제
     * 
     */
    async deleteWorkspace(userId:number,workspaceId: number) {

      await this.isOwner(userId,workspaceId);

      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try{
        await this.verifyWorkSpaceById(workspaceId);

        await queryRunner.manager.delete('users_model_workspaces_workspaces_model', { workspacesModelId: workspaceId });

        await queryRunner.manager.delete(WorkspacesModel,{id:workspaceId});

        await queryRunner.commitTransaction();

        return {
          "message":"해당 워크스페이스 삭제되었습니다."
        }

      }catch(error){
        await queryRunner.rollbackTransaction();
        console.log(`error : ${error}`)
        if (error instanceof HttpException) {
          // HttpException을 상속한 경우(statusCode 속성이 있는 경우)
          throw error;
        } else {
          // 그 외의 예외
          throw new InternalServerErrorException('서버 에러가 발생했습니다.');
        }
      }finally{
        await queryRunner.release();
      }
    }

    async inviteMembers(userId:number,workspaceId:number,membersDto:MembersDto) {

      await this.isOwner(userId,workspaceId);

      const members = membersDto.members;
      const isSpaceMembers = await this.listWorkSpaceMember(workspaceId);

      const values = await Promise.all(members.map(async (memberId) => {
        await this.findByUserId(memberId);
        
        // workSpaceMembers 배열에서 user_id가 memberId와 일치하는 사용자 찾기
        const isUserInWorkSpaceMembers = isSpaceMembers.some(member => member.user_id === memberId);

        if (isUserInWorkSpaceMembers) {
          // 사용자가 workSpaceMembers 배열에 존재하지 않는 경우에 대한 처리
          throw new NotFoundException(`사용자 ID ${memberId} (이)가 워크스페이스 멤버로 이미 있습니다.`);
        }
      
        return {
          usersModelId: memberId,
          workspacesModelId: workspaceId,
        };
      }));

      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try{

        console.log(`values : ${values}`);

        await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('users_model_workspaces_workspaces_model')
        .values(values)
        .execute();
      
        await queryRunner.commitTransaction();

        return {
          "message":"워크스페이스 멤버 추가했습니다."
        }

      }catch(error){
        await queryRunner.rollbackTransaction();

        console.log(`error : ${error.name}`);

        if (error instanceof HttpException) {
          // HttpException을 상속한 경우(statusCode 속성이 있는 경우)
          throw error;
        } else {
          // 그 외의 예외
          new InternalServerErrorException('서버 에러가 발생했습니다.');
        }
      }finally{
        await queryRunner.release();
      }
  
  } 

    private async verifyWorkSpaceById(id: number) {
        const workspace = await this.workspaceRepository.findOneBy({ id });
        if (!workspace) {
          throw new NotFoundException('존재하지 않는 워크스페이스입니다.');
        }
    
        return workspace;
    }

    private async findByUserId(userId: number) {

      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try{

        const user = await queryRunner.manager
        .createQueryBuilder()
        .select([
          'id AS user_id',
          'email AS email',
          'name AS name',
        ])
        .from(UsersModel, 'users_model')
        .where('users_model.id = :userId', { userId })
        .getRawMany();

        console.log(`user:${user[0].user_id}`)
        if (!user[0].user_id) {
          throw new NotFoundException('존재하지 않는 사용자입니다.');
        }
  
        await queryRunner.commitTransaction();

        return user;

      }catch(error){

        console.log(`error22222 : ${error}`);

        await queryRunner.rollbackTransaction();

        if (error instanceof HttpException) {
          // HttpException을 상속한 경우(statusCode 속성이 있는 경우)
          throw error;
        } else {
          // 그 외의 예외
          if(error.name==='TypeError') throw new NotFoundException(`가입 안된 사용자 ID (userId:${userId})가 있습니다.`);
          else throw new InternalServerErrorException('서버 에러가 발생했습니다.');
        }

      }finally{
        await queryRunner.release();
      }
    }

    async isOwner(userId:number,workspaceId:number){

      const owner = await this.workspaceRepository.findOneBy({
        ownerId:userId,
        id:workspaceId
      })

      if(!owner){
        throw new NotFoundException('워크스페이스 운영자가 아닙니다.');
      }

      return true;

    }

    async listWorkSpaceMember(workspaceId:number){

      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try{

        const user = await queryRunner.manager
        .createQueryBuilder()
        .select([
          'usersModelId AS user_id'
        ])
        .from('users_model_workspaces_workspaces_model', 'users_model')
        .where('users_model.workspacesModelId = :workspaceId', { workspaceId })
        .getRawMany();
  
        await queryRunner.commitTransaction();

        return user;

      }catch(error){

        await queryRunner.rollbackTransaction();

        if (error instanceof HttpException) {
          // HttpException을 상속한 경우(statusCode 속성이 있는 경우)
          throw error;
        } else {
          // 그 외의 예외
          throw new InternalServerErrorException('서버 에러가 발생했습니다.');
        }

      }finally{
        await queryRunner.release();
      }

    }

}
