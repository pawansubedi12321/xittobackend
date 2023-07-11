import {IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength} from 'class-validator';
import {GenericEntity} from "../../utils/generic.entity";

export class CreateServiceDto extends GenericEntity{
    id: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsBoolean()
    status:boolean


    @IsOptional()
    description: string;

    @IsOptional()
    image_url: string;

}
