import { PipeTransform } from "@nestjs/common";
import {} from 'zod'
export class ZoValidationPipe implements PipeTransform{
  constructor(private schema: ZodStandardSchemaWithJSON)
}