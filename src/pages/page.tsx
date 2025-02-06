// import { Book, PersonStanding } from 'lucide-react';
import { BiBook } from 'react-icons/bi';
import { BiUser } from 'react-icons/bi';

interface FeaturedBook {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
}

const HomePage = () => {
  const featuredBooks: FeaturedBook[] = [
    { id: '1', title: 'The First Novel', author: 'Jane Smith', coverUrl: '' },
    { id: '2', title: 'Another Story', author: 'John Doe', coverUrl: '' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold">NovelHub</h1>
            <div className="flex space-x-4">
              <button className="flex items-center px-4 py-2 rounded-md bg-blue-600 text-white">
                <BiBook className="mr-2 h-4 w-4" />
                Read
              </button>
              <button className="flex items-center px-4 py-2 rounded-md bg-green-600 text-white">
                <BiUser className="mr-2 h-4 w-4" />
                Become Author
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Featured Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <div key={book.id} className="bg-white rounded-lg shadow overflow-hidden">
                <img src={book.coverUrl} alt={book.title} className="w-full h-64 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{book.title}</h3>
                  <p className="text-gray-600">{book.author}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Start Reading</h2>
            <p className="text-gray-700 mb-4">
              Discover thousands of stories from talented authors around the world.
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Browse Library
            </button>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Write Your Story</h2>
            <p className="text-gray-700 mb-4">
              Share your creativity with our growing community of readers.
            </p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md">
              Start Writing
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;