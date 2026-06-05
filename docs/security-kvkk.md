# Güvenlik ve KVKK

- Şifreler Argon2 ile ve pepper kullanılarak hashlenir.
- Zorunlu onaylar immutable `ConsentLog` kayıtları olarak tutulur.
- Audit log sadece güvenli metadata içerir.
- JWT sırları ortam değişkenlerinden okunur.
