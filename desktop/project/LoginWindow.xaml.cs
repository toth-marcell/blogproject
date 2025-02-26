using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.Net.Http;
using Newtonsoft.Json;
namespace project
{
    /// <summary>
    /// Interaction logic for LoginWindow.xaml
    /// </summary>
    public partial class LoginWindow : Window
    {
        public LoginWindow()
        {
            InitializeComponent();
        }
        private void cancelButton_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = false;
        }
        private async void registerButton_Click(object sender, RoutedEventArgs e) => LoginFunction("/register");
        private async void loginButton_Click(object sender, RoutedEventArgs e) => LoginFunction("/login");
        async void LoginFunction(string path)
        {
            var body = new StringContent(JsonConvert.SerializeObject(new LoginBody(nameField.Text, passwordField.Password)), Encoding.UTF8, "application/json");
            HttpResponseMessage result = await API.httpClient.PostAsync(API.APIURL + path, body);
            var content = await result.Content.ReadAsStringAsync();
            try
            {
                result.EnsureSuccessStatusCode();
                LoginResponse loginResponse = JsonConvert.DeserializeObject<LoginResponse>(content);
                LoggedInUser.Id = loginResponse.Id;
                LoggedInUser.Token = loginResponse.Token;
                LoggedInUser.Name = nameField.Text;
            }
            catch
            {
                var msg = JsonConvert.DeserializeObject<APIError>(content).msg;
                MessageBox.Show(msg);
            }
            DialogResult = true;
        }
    }
    class LoginBody
    {
        public LoginBody(string name, string password)
        {
            this.name = name;
            this.password = password;
        }
        public string name { get; set; }
        public string password { get; set; }
    }
    class LoginResponse
    {
        public int Id { get; set; }
        public string Token { get; set; }
    }
    class APIError
    {
        public string msg { get; set; }
    }
}
