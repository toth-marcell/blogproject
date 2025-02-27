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
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Net.Http;
using Newtonsoft.Json;
namespace project
{
    /// <summary>
    /// Interaction logic for PostControl.xaml
    /// </summary>
    public partial class PostControl : UserControl
    {
        Action Refresh;
        public PostControl(Post post, Action refresh)
        {
            InitializeComponent();
            DataContext = post;
            Refresh = refresh;
            if (LoggedInUser.Token != null && (LoggedInUser.Id == post.User.Id || LoggedInUser.IsAdmin))
            {
                deleteButton.Visibility = Visibility.Visible;
            }
        }
        private async void deleteButton_Click(object sender, RoutedEventArgs e)
        {
            var body = new StringContent(JsonConvert.SerializeObject(new TokenBody(LoggedInUser.Token)), Encoding.UTF8, "application/json");
            var result = await API.httpClient.PostAsync(API.APIURL + $"/deletepost?id={(DataContext as Post).Id}", body);
            var content = await result.Content.ReadAsStringAsync();
            try
            {
                result.EnsureSuccessStatusCode();
                MessageBox.Show("Success!");
            }
            catch
            {
                string msg = JsonConvert.DeserializeObject<APIError>(content).msg;
                MessageBox.Show(msg, "Error");
            }
            Refresh();
        }
    }
    class TokenBody
    {
        public TokenBody(string token)
        {
            this.token = token;
        }
        public string token { get; set; }
    }
}
