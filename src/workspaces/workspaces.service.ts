import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspacesModel } from './entities/workspaces.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@Injectable()
export class WorkspacesService {
    constructor(
        @InjectRepository(WorkspacesModel)
        private workspaceRepository: Repository<WorkspacesModel>
      ) {}
    
      async createWorkspace(createworkspaceDto:CreateWorkspaceDto) {

        const workspace = this.workspaceRepository.create({
                        name:createworkspaceDto.name,
                        description:createworkspaceDto.description,
                        color:createworkspaceDto.color
                    });

        // TODO: worksapce 추가시 ownerId 추가 어떻게?

        // TODO: 작성자 멤버(users_model_workspaces_workspaces_model)도 저장하는 로직 추가!!!!



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

    async findOneWorkspace(workspaceId: number) {
        const workspace = await this.verifyWorkSpaceById(workspaceId);
  
          return {
            "message":"워크스페이스 상세 조회되었습니다.",
            "data":workspace
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
        await this.workspaceRepository.delete({id:workspaceId});
  
          return {
            "message":"해당 워크스페이스 삭제되었습니다."
          }
    }

    private async verifyWorkSpaceById(id: number) {
        const workspace = await this.workspaceRepository.findOneBy({ id });
        if (!workspace) {
          throw new NotFoundException('존재하지 않는 워크스페이스입니다.');
        }
    
        return workspace;
    }

}
