import { Injectable } from '@nestjs/common';
import { JSONFilePreset } from 'lowdb/node';

@Injectable()
export class GuestService {

  private readonly dbFile =
    'db/guests.json';

  async getGuests() {

    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          guests: [],
        },
      );

    return db.data.guests;
  }

  async getGuestById(
    guestId: string,
  ) {

    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          guests: [],
        },
      );

    return db.data.guests.find(
      (guest: any) =>
        guest.guestId ===
        guestId,
    );
  }

  async createGuest(
    guest: any,
  ) {

    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          guests: [],
        },
      );

    db.data.guests.push(
      guest,
    );

    await db.write();

    return {
      success: true,
      message:
        'Guest Created Successfully',
      data: guest,
    };
  }

  async createGuestRegistration(
    guest: any,
  ) {
    const email =
      typeof guest.email === 'string'
        ? guest.email.trim().toLowerCase()
        : '';

    if (!email) {
      return {
        success: false,
        message: 'An email address is required to submit a registration',
      };
    }

    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          guests: [],
        },
      );

    const existingGuest =
      db.data.guests.find(
        (item: any) =>
          typeof item.email === 'string' &&
          item.email.trim().toLowerCase() === email,
      );

    if (existingGuest) {
      return {
        success: false,
        message: 'A guest registration has already been submitted for this account',
        data: existingGuest,
      };
    }

    const registration = {
      ...guest,
      email,
      status: 'PENDING_APPROVAL',
    };

    db.data.guests.push(registration);
    await db.write();

    return {
      success: true,
      message: 'Guest registration submitted successfully',
      data: registration,
    };
  }

  async updateGuest(
    guestId: string,
    guestData: any,
  ) {

    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          guests: [],
        },
      );

    const index =
      db.data.guests.findIndex(
        (guest: any) =>
          guest.guestId ===
          guestId,
      );

    if (index === -1) {
      return {
        success: false,
        message:
          'Guest Not Found',
      };
    }

    db.data.guests[index] = {
      ...db.data.guests[index],
      ...guestData,
    };

    await db.write();

    return {
      success: true,
      message:
        'Guest Updated Successfully',
      data:
        db.data.guests[index],
    };
  }

  async deleteGuest(
    guestId: string,
  ) {

    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          guests: [],
        },
      );

    const guests =
      db.data.guests.filter(
        (guest: any) =>
          guest.guestId !==
          guestId,
      );

    db.data.guests = guests;

    await db.write();

    return {
      success: true,
      message:
        'Guest Deleted Successfully',
    };
  }

  async approveGuest(
  guestId: string,
) {
  const db =
    await JSONFilePreset(
      this.dbFile,
      {
        guests: [],
      },
    );

  const guest =
    db.data.guests.find(
      (g: any) =>
        g.guestId ===
        guestId,
    );

  if (!guest) {
    return {
      success: false,
      message:
        'Guest Not Found',
    };
  }

  guest.status =
    'APPROVED';

  await db.write();

  return {
    success: true,
    message:
      'Guest Approved Successfully',
    data: guest,
  };
}
async rejectGuest(
  guestId: string,
) {
  const db =
    await JSONFilePreset(
      this.dbFile,
      {
        guests: [],
      },
    );

  const guest =
    db.data.guests.find(
      (g: any) =>
        g.guestId ===
        guestId,
    );

  if (!guest) {
    return {
      success: false,
      message:
        'Guest Not Found',
    };
  }

  guest.status =
    'REJECTED';

  await db.write();

  return {
    success: true,
    message:
      'Guest Rejected Successfully',
    data: guest,
  };
}
  async checkIn(
    guestId: string,
  ) {

    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          guests: [],
        },
      );

    const guest =
      db.data.guests.find(
        (g: any) =>
          g.guestId ===
          guestId,
      );

    if (!guest) {
      return {
        success: false,
        message:
          'Guest Not Found',
      };
    }

    guest.status =
      'CHECKED_IN';

    await db.write();

    return {
      success: true,
      message:
        'Guest Checked In',
      data: guest,
    };
  }

  async checkOut(
    guestId: string,
  ) {

    const db =
      await JSONFilePreset(
        this.dbFile,
        {
          guests: [],
        },
      );

    const guest =
      db.data.guests.find(
        (g: any) =>
          g.guestId ===
          guestId,
      );

    if (!guest) {
      return {
        success: false,
        message:
          'Guest Not Found',
      };
    }

    guest.status =
      'CHECKED_OUT';

    await db.write();

    return {
      success: true,
      message:
        'Guest Checked Out',
      data: guest,
    };
  }
}