import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel';
import Pet from './models/petModel';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

const seedData = async (): Promise<void> => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pet_management_system');
            console.log('MongoDB Connected');
        }

        // Create Users
        const adminEmail = 'patilbhavesh7874@gmail.com';
        try {
            const existingAdmin = await User.findOne({ email: adminEmail });
            if (!existingAdmin) {
                await User.create({
                    name: 'Bhavesh Patil',
                    email: adminEmail,
                    password: 'Test@123', // Will be hashed by pre-save hook
                    role: 'admin'
                });
                console.log('Admin user created');
            } else {
                console.log('Admin user already exists');
            }
        } catch (error) {
             if (error instanceof Error) {
                 console.error('Error creating admin user:', error.message);
             }
        }

        const userEmail = 'patilbhavesh7874+user@gmail.com';
        try {
            const existingUser = await User.findOne({ email: userEmail });
            if (!existingUser) {
                await User.create({
                    name: 'Bhavesh Patil',
                    email: userEmail,
                    password: 'Test@123', // Will be hashed by pre-save hook
                    role: 'user'
                });
                console.log('Normal user created');
            } else {
                console.log('Normal user already exists');
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error creating normal user:', error.message);
            }
        }

        // Create Pets
        try {
            const petCount = await Pet.countDocuments();
            if (petCount === 0) {
                const pets = [
                    {
                        name: 'Buddy',
                        species: 'Dog',
                        breed: 'Golden Retriever',
                        age: 3,
                        description: 'Buddy is a friendly and energetic Golden Retriever who loves to play fetch and go for long walks. He is great with kids and other dogs.',
                        images: ['https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80'],
                        status: 'available'
                    },
                    {
                        name: 'Luna',
                        species: 'Cat',
                        breed: 'Siamese',
                        age: 2,
                        description: 'Luna is a vocal and affectionate Siamese cat. She loves to curl up on laps and be petted. She would do best in a quiet home.',
                        images: ['https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80'],
                        status: 'available'
                    },
                    {
                        name: 'Max',
                        species: 'Dog',
                        breed: 'German Shepherd',
                        age: 4,
                        description: 'Max is a loyal and intelligent German Shepherd. He is well-trained and protective of his family. He needs an active owner.',
                        images: ['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80'],
                        status: 'available'
                    },
                    {
                        name: 'Bella',
                        species: 'Dog',
                        breed: 'Beagle',
                        age: 1,
                        description: 'Bella is a curious and playful Beagle puppy. She loves to sniff around and explore new places. She needs some patience with potty training.',
                        images: ['https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80'],
                        status: 'adopted'
                    },
                    {
                        name: 'Simba',
                        species: 'Cat',
                        breed: 'Maine Coon',
                        age: 5,
                        description: 'Simba is a large and gentle Maine Coon. He is very chill and gets along with everyone. He loves to nap in sunny spots.',
                        images: ['https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&q=80'],
                        status: 'available'
                    },
                    {
                        name: 'Charlie',
                        species: 'Dog',
                        breed: 'Labrador Retriever',
                        age: 2,
                        description: 'Charlie is a happy-go-lucky Labrador who loves water and treats. He knows basic commands and is eager to please.',
                        images: ['https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?auto=format&fit=crop&q=80'],
                        status: 'pending'
                    }
                ];

                await Pet.insertMany(pets);
                console.log('Pets created');
            } else {
                console.log('Pets already exist, skipping creation');
            }
        } catch (error) {
             if (error instanceof Error) {
                console.error('Error creating pets:', error.message);
             }
        }

        console.log('Seeding completed successfully');
        if (require.main === module) {
            process.exit();
        }
    } catch (error) {
        console.error('Error seeding data:', error);
        if (require.main === module) {
            process.exit(1);
        }
    }
};

if (require.main === module) {
    seedData();
}

export { seedData };
