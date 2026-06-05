import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

@Injectable()
export class PermissionsService {
  canAccessBooking(user: { id: string; roles: UserRole[] }, booking: any) {
    if (user.roles.includes(UserRole.ADMIN)) return true;
    if (booking.customerId === user.id) return true;
    if (booking.talent.userId === user.id) return true;
    return booking.talent.managers?.some((manager: any) => manager.managerId === user.id) ?? false;
  }

  canManageTalent(user: { id: string; roles: UserRole[] }, talent: any) {
    if (user.roles.includes(UserRole.ADMIN)) return true;
    if (talent.userId === user.id) return true;
    return talent.managers?.some((manager: any) => manager.managerId === user.id) ?? false;
  }
}
