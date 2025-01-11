import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { FeeService } from './fee.service';
import { PdfService } from '../pdf/pdf.service';
import { CreateFeeDto, UpdateFeeDto, PayFeeDto } from './dto/fee.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Fees')
@Controller('fees')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FeeController {
  constructor(
    private readonly feeService: FeeService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Create a new fee',
    description: 'Create a new fee record for a student, including base fee and extra curriculum fees.'
  })
  @ApiResponse({ status: 201, description: 'Fee record created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin privileges' })
  create(@Body() createFeeDto: CreateFeeDto) {
    return this.feeService.create(createFeeDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Get all fees',
    description: 'Retrieve all fee records. Available only to administrators.'
  })
  @ApiResponse({ status: 200, description: 'List of all fee records' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin privileges' })
  findAll() {
    return this.feeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a fee by id',
    description: 'Retrieve detailed information about a specific fee record.'
  })
  @ApiResponse({ status: 200, description: 'Fee record found' })
  @ApiResponse({ status: 404, description: 'Fee record not found' })
  findOne(@Param('id') id: string) {
    return this.feeService.findOne(id);
  }

  @Get('student/:studentId')
  @ApiOperation({ 
    summary: 'Get all fees for a student',
    description: 'Retrieve all fee records associated with a specific student.'
  })
  @ApiResponse({ status: 200, description: 'List of student fee records' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findByStudent(@Param('studentId') studentId: string) {
    return this.feeService.findByStudent(studentId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Update a fee',
    description: 'Update fee details including amount, due date, and status.'
  })
  @ApiResponse({ status: 200, description: 'Fee record updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires admin privileges' })
  @ApiResponse({ status: 404, description: 'Fee record not found' })
  update(@Param('id') id: string, @Body() updateFeeDto: UpdateFeeDto) {
    return this.feeService.update(id, updateFeeDto);
  }

  @Post(':id/pay')
  @Roles(UserRole.PARENT)
  @ApiOperation({ 
    summary: 'Pay a fee',
    description: 'Process fee payment for a student. Only available to parents.'
  })
  @ApiResponse({ status: 200, description: 'Payment processed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payment amount' })
  @ApiResponse({ status: 403, description: 'Forbidden - Only parents can make payments' })
  @ApiResponse({ status: 404, description: 'Fee record not found' })
  payFee(@Param('id') id: string, @Body() payFeeDto: PayFeeDto) {
    return this.feeService.payFee(id, payFeeDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ 
    summary: 'Delete a fee',
    description: 'Delete a fee record. Only available to super administrators.'
  })
  @ApiResponse({ status: 200, description: 'Fee record deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Requires super admin privileges' })
  @ApiResponse({ status: 404, description: 'Fee record not found' })
  remove(@Param('id') id: string) {
    return this.feeService.remove(id);
  }

  @Get(':id/invoice')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Download fee invoice' })
  async downloadInvoice(@Param('id') id: string, @Res() res: Response) {
    const fee = await this.feeService.findOne(id);
    const pdfBuffer = await this.pdfService.generateFeeInvoice(fee);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    
    res.end(pdfBuffer);
  }
}
