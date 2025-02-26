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
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            FetchPosts();
            UpdateStatusBar();
        }
        public async void FetchPosts()
        {
            HttpResponseMessage result = await API.httpClient.GetAsync(API.APIURL + "/posts");
            string body = await result.Content.ReadAsStringAsync();
            List<Post> posts = JsonConvert.DeserializeObject<List<Post>>(body);
            PostsPanel.Children.Clear();
            foreach (Post post in posts)
            {
                PostControl postControl = new PostControl { DataContext = post };
                PostsPanel.Children.Add(postControl);
            }
        }
        private void refreshButton_Click(object sender, RoutedEventArgs e) => FetchPosts();

        private void loginButton_Click(object sender, RoutedEventArgs e)
        {
            if (LoggedInUser.Token == null)
            {
                new LoginWindow().ShowDialog();
                UpdateStatusBar();
            }
            else
            {
                LoggedInUser.Token = null;
                UpdateStatusBar();
            }
        }
        void UpdateStatusBar()
        {
            if (LoggedInUser.Token == null)
            {
                statusBar.Content = "Not logged in.";
                loginButton.Header = "_Login";
            }
            else
            {
                statusBar.Content = "Logged in as " + LoggedInUser.Name;
                loginButton.Header = "_Logout";
            }
        }

        private void newpostButton_Click(object sender, RoutedEventArgs e)
        {
            if (LoggedInUser.Token == null)
            {
                MessageBox.Show("You must first log in!");
            }
            else
            {
                new NewPostWindow().ShowDialog();
                FetchPosts();
            }
        }
    }
}
