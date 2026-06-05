import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { UserRole } from '@prisma/client';
import { PermissionsService } from '../src/modules/common/permissions.service';

describe('permissions helpers', () => {
  const service = new PermissionsService();

  it('allows admin to access booking', () => {
    assert.equal(
      service.canAccessBooking(
        { id: 'admin', roles: [UserRole.ADMIN] },
        { customerId: 'x', talent: { userId: 'y', managers: [] } },
      ),
      true,
    );
  });

  it('allows owner to manage talent', () => {
    assert.equal(service.canManageTalent({ id: 'owner', roles: [UserRole.TALENT] }, { userId: 'owner', managers: [] }), true);
  });
});
