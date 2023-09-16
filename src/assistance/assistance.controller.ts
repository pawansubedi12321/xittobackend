import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, ClassSerializerInterceptor, Req } from '@nestjs/common';
import { AssistanceService } from './assistance.service';
import { CreateAssistanceDto } from './dto/create-assistance.dto';
import { UpdateAssistanceDto } from './dto/update-assistance.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt_auth.guards';
import { RolesGuard } from 'src/auth/guards/role_guard';
import { HasRoles } from 'src/core/decorators/has-role.decorator';
import { Role } from 'src/utils/enum/role.enum';
import { ResponseMessage } from 'src/core/decorators/response.decorator';

@Controller('assistance')
export class AssistanceController {
  constructor(private readonly assistanceService: AssistanceService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(Role.USER, Role.WORKER)
  @ResponseMessage('Successfully applied')
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Req() req: any,@Body() createAssistanceDto: CreateAssistanceDto) {
    return this.assistanceService.create(createAssistanceDto, req.user);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Assistance List fetched successfully ')
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@Req() req: any) {
    return this.assistanceService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assistanceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssistanceDto: UpdateAssistanceDto) {
    return this.assistanceService.update(+id, updateAssistanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assistanceService.remove(+id);
  }
}