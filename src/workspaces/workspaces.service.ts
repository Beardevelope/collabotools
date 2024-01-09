import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository, getConnection } from 'typeorm';
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
    
      async createWorkspace(createworkspaceDto:CreateWorkspaceDto) {

        const workspace = this.workspaceRepository.create({
                        name:createworkspaceDto.name,
                        description:createworkspaceDto.description,
                        color:createworkspaceDto.color
                    });

        // TODO: worksapce 추가시 ownerId 추가 어떻게? 인가된 값으로 추가

        // TODO: 작성자 멤버(users_model_workspaces_workspaces_model)도 owner에 저장하는 로직 추가!!!!



        // workspace 정보 저장
        await this.workspaceRepository.save(workspace);


        return {
          "message":"워크스페이스를 생성했습니다.",
          "data": workspace
        }
    
    }

    async findAllWorkspace() {
        const workspaces = await this.workspaceRepository.find({
            select:['id','name']
        });
      
        return {
          "message":"워크스페이스를 조회했습니다.",
          "data":workspaces
        }
    }

    async updateWorkspace(workspaceId: number, createworkspaceDto:CreateWorkspaceDto) {

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

    async deleteWorkspace(workspaceId: number) {

      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try{
        await this.verifyWorkSpaceById(workspaceId);

        await queryRunner.manager.delete(ListsModel,{workspaceId:workspaceId});

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

    async inviteMembers(membersDto:MembersDto) {

      const members = membersDto.members;

      const values = members.map(({ userId, workspaceId }) => ({
        usersModelId: userId,
        workspacesModelId: workspaceId,
      }));

      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try{

        // TODO: 멤버 추가시 동일 워크스페이스에 기존 등록한 멤버 있는지 확인

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

    private async verifyWorkSpaceById(id: number) {
        const workspace = await this.workspaceRepository.findOneBy({ id });
        if (!workspace) {
          throw new NotFoundException('존재하지 않는 워크스페이스입니다.');
        }
    
        return workspace;
    }

    private async findByEmail(email: string) {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        throw new NotFoundException('존재하지 않는 사용자입니다.');
      }

      return user;
    }

}
