import User, { UserRole } from '../models/userModel';


// Default yönetici bilgileri (çevresel değişkenlerden veya güvenli bir yerden alınmalıdır)
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '12345678'; 

async function initializeAdmin() {
    try {
        // 1. Herhangi bir kullanıcı var mı kontrol et (alternatif olarak sadece admin rolünde kullanıcı var mı kontrol edilebilir)
        const userCount = await User.countDocuments(); 

        if (userCount === 0) {
            console.log('Veritabanında hiç kullanıcı bulunamadı. Varsayılan yönetici oluşturuluyor...');
            
            // Not: Kullanıcı modelinizdeki 'role' alanını kullanın.
            const adminUser = new User({
                email: DEFAULT_ADMIN_EMAIL,
                password: DEFAULT_ADMIN_PASSWORD, // Modeldeki 'pre('save')' hook'u bu şifreyi otomatik hashleyecektir.
                role: 'admin'
                
            });

            await adminUser.save();
            
            console.log(`Varsayılan yönetici başarıyla oluşturuldu: ${DEFAULT_ADMIN_EMAIL}`);
        } else {
            // Eğer isterseniz, sadece admin rolünde kullanıcı var mı kontrol edebilirsiniz.
            // const adminExists = await User.findOne({ role: 'admin' });
            // if (!adminExists) { ... yeni admin oluşturma mantığı ... }
            console.log('Veritabanında en az bir kullanıcı bulundu. Varsayılan yönetici oluşturma işlemi atlandı.');
        }
    } catch (error) {
        console.error('Yönetici başlatılırken bir hata oluştu:', error);
        // Hata durumunda uygulamanın başlatılmasını engellemek isteyebilirsiniz.
        // process.exit(1); 
    }
}

module.exports = initializeAdmin;