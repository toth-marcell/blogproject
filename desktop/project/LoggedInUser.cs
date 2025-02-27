using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
namespace project
{
    public static class LoggedInUser
    {
        public static int Id { get; set; }
        public static string Token { get; set; }
        public static string Name { get; set; }
        public static bool IsAdmin { get; set; }
    }
}
