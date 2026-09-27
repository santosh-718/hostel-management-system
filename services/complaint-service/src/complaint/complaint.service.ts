import { Injectable } from '@nestjs/common';

@Injectable()
export class ComplaintService {

  getComplaints() {
    return [
      {
        complaintId: 'CMP001',
        roomNumber: '101',
        guestName: 'Santosh',
        category: 'Internet',
        description: 'WiFi not working',
        priority: 'HIGH',
        status: 'OPEN',
      },
    ];
  }

  getComplaintById(
    complaintId: string,
  ) {
    return {
      complaintId,
      roomNumber: '101',
      guestName: 'Santosh',
      category: 'Internet',
      description: 'WiFi not working',
      priority: 'HIGH',
      status: 'OPEN',
    };
  }

  createComplaint(
    complaint: any,
  ) {
    return {
      message:
        'Complaint Created Successfully',
      data: complaint,
    };
  }

  updateComplaint(
    complaintId: string,
    complaint: any,
  ) {
    return {
      message:
        'Complaint Updated Successfully',
      complaintId,
      data: complaint,
    };
  }

  deleteComplaint(
    complaintId: string,
  ) {
    return {
      message:
        'Complaint Deleted Successfully',
      complaintId,
    };
  }

  assignComplaint(
    complaintId: string,
  ) {
    return {
      complaintId,
      status: 'ASSIGNED',
    };
  }

  resolveComplaint(
    complaintId: string,
  ) {
    return {
      complaintId,
      status: 'RESOLVED',
    };
  }
}
