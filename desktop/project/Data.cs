using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace project
{
    public class Post
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Text { get; set; }
        public string CreatedAt { get; set; }
        public User User { get; set; }
    }
    public class User
    {
        public string Name { get; set; }
        public bool isAdmin { get; set; }
    }
}
