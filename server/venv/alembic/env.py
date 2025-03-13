import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.ext.asyncio import create_async_engine

from alembic import context
# Импортируйте метаданные ваших моделей
# Например, если у вас есть файл models.py с Base
from models import Base

# Импортируем объект конфигурации Alembic
config = context.config

# Настройка логирования, если указана конфигурация в alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


target_metadata = Base.metadata

# Функция для работы в offline режиме
def run_migrations_offline():
    """Запуск миграций в offline режиме.

    В этом режиме используется только URL подключения,
    и SQL-команды будут выводиться в виде скрипта.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

# Функция для синхронного выполнения миграций (будет вызвана из асинхронного контекста)
def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

# Асинхронная функция для выполнения миграций в онлайн режиме
async def run_migrations_online():
    """
    Создаем асинхронный движок для подключения к базе данных,
    подключаемся и выполняем миграции внутри асинхронного контекста.
    """
    connectable = create_async_engine(
        config.get_main_option("sqlalchemy.url"),
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        # Функция run_sync принимает синхронную функцию и выполняет её в асинхронном контексте
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()

# Основной блок: выбор режима работы Alembic (offline или online)
if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
