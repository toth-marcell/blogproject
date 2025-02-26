using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
namespace project
{
    public static class API
    {
        public static readonly string APIURL = "http://localhost:8080/api";
        public static HttpClient httpClient = new HttpClient();
    }
}
