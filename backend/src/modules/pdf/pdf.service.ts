import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  constructor(private configService: ConfigService) {}

  async generateFeeInvoice(feeData: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // School Header
      doc.fontSize(20).text(this.configService.get('SCHOOL_NAME'), { align: 'center' });
      doc.fontSize(12).text(this.configService.get('SCHOOL_ADDRESS'), { align: 'center' });
      doc.text(`Phone: ${this.configService.get('SCHOOL_PHONE')}`, { align: 'center' });
      doc.text(`Email: ${this.configService.get('SCHOOL_EMAIL')}`, { align: 'center' });
      doc.moveDown();

      // Invoice Details
      doc.fontSize(16).text('Fee Invoice', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`Invoice Date: ${new Date().toLocaleDateString()}`);
      doc.text(`Invoice Number: ${feeData.id}`);
      doc.moveDown();

      // Student Details
      doc.text(`Student Name: ${feeData.student.firstName} ${feeData.student.lastName}`);
      doc.text(`Class: ${feeData.class.grade}-${feeData.class.section}`);
      doc.moveDown();

      // Fee Details
      doc.text('Fee Details:');
      doc.text(`Base Fee: ${feeData.amount}`);
      if (feeData.extraCurriculumFee > 0) {
        doc.text(`Extra Curriculum Fee: ${feeData.extraCurriculumFee}`);
      }
      doc.text(`Total Amount: ${feeData.totalAmount}`);
      doc.moveDown();

      // Payment Status
      doc.text(`Status: ${feeData.status.toUpperCase()}`);
      if (feeData.paidAt) {
        doc.text(`Paid On: ${new Date(feeData.paidAt).toLocaleDateString()}`);
      }

      doc.end();
    });
  }

  async generateExamResult(resultData: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // School Header
      doc.fontSize(20).text(this.configService.get('SCHOOL_NAME'), { align: 'center' });
      doc.fontSize(12).text(this.configService.get('SCHOOL_ADDRESS'), { align: 'center' });
      doc.moveDown();

      // Result Header
      doc.fontSize(16).text('Examination Result', { align: 'center' });
      doc.moveDown();

      // Student Details
      doc.fontSize(12).text(`Student Name: ${resultData.student.firstName} ${resultData.student.lastName}`);
      doc.text(`Class: ${resultData.class.grade}-${resultData.class.section}`);
      doc.text(`Exam: ${resultData.exam.name}`);
      doc.moveDown();

      // Result Details
      doc.text(`Subject: ${resultData.subject.name} (${resultData.subject.code})`);
      doc.text(`Marks Obtained: ${resultData.marksObtained}`);
      doc.text(`Total Marks: ${resultData.totalMarks}`);
      doc.text(`Percentage: ${resultData.percentage}%`);
      if (resultData.rank) {
        doc.text(`Rank in Class: ${resultData.rank}`);
      }
      doc.moveDown();

      // Teacher Remarks
      if (resultData.teacherRemarks) {
        doc.text('Teacher Remarks:');
        doc.text(resultData.teacherRemarks);
      }

      doc.end();
    });
  }
}
