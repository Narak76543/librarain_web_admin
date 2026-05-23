globalThis.__timing__.logStart('Load chunks/build/useMockData-eX352thy');const useMockData = () => {
  const stats = {
    totalBooks: 243,
    totalOrders: 89,
    totalUsers: 512,
    totalRevenue: 12480
  };
  const books = [
    {
      id: "1",
      title: "The Midnight Library",
      author: "Matt Haig",
      category: "Fiction",
      price: 18.5,
      stock: 45,
      rating: 4.2,
      status: true,
      cover: "https://via.placeholder.com/48x64"
    },
    {
      id: "2",
      title: "The Silent Patient",
      author: "Alex Michaelides",
      category: "Fiction",
      price: 14.2,
      stock: 30,
      rating: 4.5,
      status: true,
      cover: "https://via.placeholder.com/48x64"
    },
    {
      id: "3",
      title: "Atomic Habits",
      author: "James Clear",
      category: "Self-Help",
      price: 16.99,
      stock: 100,
      rating: 4.8,
      status: true,
      cover: "https://via.placeholder.com/48x64"
    },
    {
      id: "4",
      title: "Sapiens",
      author: "Yuval Noah Harari",
      category: "History",
      price: 19.99,
      stock: 60,
      rating: 4.6,
      status: true,
      cover: "https://via.placeholder.com/48x64"
    },
    {
      id: "5",
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      category: "Science",
      price: 12.99,
      stock: 25,
      rating: 4.7,
      status: false,
      cover: "https://via.placeholder.com/48x64"
    }
  ];
  const categories = [
    { id: "1", name: "Fiction", slug: "fiction", books: 89, status: true },
    { id: "2", name: "Non-Fiction", slug: "non-fiction", books: 45, status: true },
    { id: "3", name: "Science", slug: "science", books: 32, status: true },
    { id: "4", name: "History", slug: "history", books: 28, status: true },
    { id: "5", name: "Self-Help", slug: "self-help", books: 41, status: true },
    { id: "6", name: "Biography", slug: "biography", books: 18, status: false }
  ];
  const orders = [
    {
      id: "#1042",
      customer: "Sarat Narak",
      email: "sarat@gmail.com",
      books: 3,
      total: 42.97,
      status: "Delivered",
      date: "May 15, 2026"
    },
    {
      id: "#1041",
      customer: "Dara Chan",
      email: "dara@gmail.com",
      books: 1,
      total: 18.5,
      status: "Processing",
      date: "May 14, 2026"
    },
    {
      id: "#1040",
      customer: "Sokha Lim",
      email: "sokha@gmail.com",
      books: 2,
      total: 31.99,
      status: "Pending",
      date: "May 13, 2026"
    },
    {
      id: "#1039",
      customer: "Maly Pich",
      email: "maly@gmail.com",
      books: 4,
      total: 67.5,
      status: "Delivered",
      date: "May 12, 2026"
    },
    {
      id: "#1038",
      customer: "Rith Sok",
      email: "rith@gmail.com",
      books: 1,
      total: 14.2,
      status: "Cancelled",
      date: "May 11, 2026"
    }
  ];
  const users = [
    {
      id: "1",
      name: "Sarat Narak",
      email: "sarat@gmail.com",
      phone: "070850965",
      role: "Admin",
      status: true,
      joined: "Jan 21, 2026"
    },
    {
      id: "2",
      name: "Dara Chan",
      email: "dara@gmail.com",
      phone: "012345678",
      role: "User",
      status: true,
      joined: "Feb 10, 2026"
    },
    {
      id: "3",
      name: "Sokha Lim",
      email: "sokha@gmail.com",
      phone: "096789012",
      role: "User",
      status: true,
      joined: "Mar 5, 2026"
    },
    {
      id: "4",
      name: "Maly Pich",
      email: "maly@gmail.com",
      phone: "078901234",
      role: "User",
      status: false,
      joined: "Apr 1, 2026"
    }
  ];
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    orders: [5, 12, 8, 15, 10, 20, 14],
    revenue: [120, 340, 180, 420, 290, 580, 390]
  };
  return { stats, books, categories, orders, users, chartData };
};

export { useMockData as u };;globalThis.__timing__.logEnd('Load chunks/build/useMockData-eX352thy');
//# sourceMappingURL=useMockData-eX352thy.mjs.map
