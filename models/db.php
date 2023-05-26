<?php
class DB
{
    private $host;
    private $db;
    private $user;
    private $password;
    private $charset;

    public function __construct()
    {
        $this->host     = 'localhost';
        $this->user     = 'root';
        $this->password = '';
        // $this->user     = 'onedoted_gcw';
        // $this->password = 'j`G(;JuIR<&9';
        $this->db       = 'onedoted_gcw';
        $this->charset  = 'utf8mb4';
    }

    function connect()
    {

        try {
            $connection = "mysql:host=" . $this->host . ";dbname=" . $this->db . ";charset=" . $this->charset;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            $pdo = new PDO($connection, $this->user, $this->password);

            return $pdo;
        } catch (PDOException $e) {
            print_r('Llama: ' . $e->getMessage());
        }
    }
}
