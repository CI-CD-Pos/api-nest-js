// Variáveis de ambiente necessárias para os testes (env.ts valida no import)
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/test_db';
process.env.SECRET = process.env.SECRET || 'test-secret-key';

require('dotenv').config();
