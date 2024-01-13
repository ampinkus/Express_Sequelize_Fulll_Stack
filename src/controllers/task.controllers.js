import { Task } from "../models/Task.js";

export async function createTask(req, res) {
  try {
    const { name, done, projectId } = req.body;
    const newTask = await Task.create({
      name,
      done,
      projectId,
    });
    res.json(newTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getTasks(req, res) {
  try {
    const tasks = await Task.findAll({
      attributes: ["id", "projectId", "name", "done"],
      order: [["id", "DESC"]], // ordenar por id de forma descendente
    });
    res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateTask(req, res) {
  const { id } = req.params;
  try {
    // en vez de usar el pk, pido que encuentre uno en especifico cuyo id sea el mismo
    const task = await Task.findOne({ 
      attributes: ["name", "projectId", "done", "id"], // que campos se quieren retornar 
      where: { id },
    });
    // set solo actualiza los campos que están presentes en el body, deja lo demás igual
    task.set(req.body); 
    await task.save();
    res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function deleteTask(req, res) {
  const { id } = req.params;
  try {
    await Task.destroy({
      where: { id },
    });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getTask(req, res) {
  const { id } = req.params;
  try {
    const task = await Task.findOne({
      where: { id },
      attributes: ["id", "projectId", "name", "done"], // que campos se quieren retornar
    });
    res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}



/*
Different update methods
The choice between Method 1 and Method 2 depends on the specific requirements and preferences of your 
application. Both methods are valid and can be suitable in different scenarios. 
Let's explore the characteristics of each method:
### Method 1 (Updating using Sequelize Instance):

export async function updateTask(req, res) {
  const { id } = req.params;
  try {
    const task = await Task.findOne({
      attributes: ["name", "projectId", "done", "id"],
      where: { id },
    });
    task.set(req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

**Pros:**
1. **Granular Control:** Using Sequelize instance methods (like `set` and `save`) provides 
fine-grained control over the update process. You can selectively update specific fields based 
on the request body.
2. **Validation:** If you have Sequelize model validation logic, it will be automatically 
triggered when using instance methods, helping to maintain data integrity.

**Cons:**
1. **Multiple Database Queries:** This method involves two queries – one to find the 
existing record and another to update it. Depending on the size of your dataset, 
this may have a performance impact.


### Method 2 (Updating using `update`):

export const updateProject = async (req, res) => { 
  try {
    const { id } = req.params;
    const { name, priority, description } = req.body;
    const project = await Project.findByPk(id);
    await Project.update({ name, priority, description }, { where: { id } });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

**Pros:**
1. **Single Query:** Using `update` allows you to perform the update operation in a single query, 
potentially offering better performance.
2. **Simplicity:** This method may be perceived as more straightforward and concise.

**Cons:**
1. **Bypasses Instance Methods:** If you have logic in Sequelize instance methods that should 
be executed during an update, using `update` will bypass those methods.

### Considerations:
- **Use Case:** If you need fine-grained control and want to leverage Sequelize instance methods 
or have custom logic associated with updating a record, Method 1 might be more appropriate.
  
- **Performance:** If performance is a critical concern, and you don't need the benefits of 
Sequelize instance methods, Method 2 with a single `update` query might be preferred.

- **Validation:** Consider whether you want Sequelize model validation to be applied 
during the update process. If yes, Method 1 is more suitable.

Ultimately, choose the method that aligns with your application's requirements, maintainability, 
and performance considerations.

User
For the method 1 could you elaborate this and give me an example?
If you have Sequelize model validation logic, it will be automatically 
triggered when using instance methods, helping to maintain data integrity.

Certainly! Sequelize allows you to define validation rules for your model attributes using the `validate` 
option when defining a model. These validation rules are executed automatically when you call instance 
methods like `save()`. This helps ensure that the data stored in your database adheres to the 
specified rules, contributing to data integrity.
Here's an example of how you can define validation rules for a Sequelize model:

// Example Project model with validation
const Project = sequelize.define('Project', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Project name cannot be null.',
      },
      len: {
        args: [3, 50],
        msg: 'Project name must be between 3 and 50 characters.',
      },
    },
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Project priority cannot be null.',
      },
      isInt: {
        msg: 'Priority must be an integer.',
      },
      min: {
        args: 1,
        msg: 'Priority must be at least 1.',
      },
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'Description must be at most 255 characters.',
      },
    },
  },
});

// Example usage of the Project model
const createProject = async () => {
  try {
    // Creating a project with invalid data
    const invalidProject = await Project.create({
      name: 'A', // Fails length validation
      priority: 'High', // Fails type validation
      description: 'This is a very long description that exceeds the limit set by validation rules.',
    });

    // This code won't be reached due to validation errors
    console.log('Invalid project:', invalidProject.get());
  } catch (error) {
    // SequelizeValidationError will be thrown with details of validation errors
    console.error('Validation error:', error.errors);
  }
};

// Call the example function
createProject();

In this example:
- The `Project` model has three attributes: `name`, `priority`, and `description`.
- Validation rules are defined using the `validate` option for each attribute.
- If an attempt is made to create a project with invalid data, Sequelize will throw 
a `SequelizeValidationError` containing details about the validation errors.

By using Sequelize instance methods like `save()` or `set()`, these validation rules are 
automatically triggered, helping to maintain data integrity by ensuring that only valid 
data is stored in the database. If you were to update a project using the `set()` method, 
Sequelize would also validate the changes based on these rules before the `save()` method is called.

This ensures that your data adheres to the specified constraints, reducing the risk of storing 
inconsistent or incorrect data in the database.
*/


/*
In the provided code snippet, the `await task.save();` statement is used to save the changes 
made to the `task` instance to the database. If any error occurs during the saving process, 
it will be thrown as an exception, and it will be caught by the surrounding `try...catch` block.
In JavaScript, when using `await` with a Promise, any rejection of the Promise 
(such as an error during saving) will cause the `async` function to throw an exception. 
In the context of the provided code:

try {
  // ...
  await task.save();  // If an error occurs during saving, it will throw an exception
  // ...
  res.json(task);
} catch (error) {
  return res.status(500).json({ message: error.message });
}
If an error occurs during the `task.save()` operation, the control will immediately jump 
to the `catch` block, where it will handle the error and send a JSON response with a 500 status code.

Therefore, while there isn't a separate `catch` block immediately following the `await task.save();` 
line, the error will still be caught by the broader `catch` block surrounding the entire 
`try...catch` structure.
This approach is common in asynchronous code where errors from asynchronous operations are 
handled at a higher level in the code, providing a centralized location for error handling. 
If you had a specific reason to handle errors from `task.save()` differently than 
other errors within the `try` block, you might consider adding a more specific `catch` block 
after `await task.save();`. However, in many cases, a single, broad `catch` block like the one 
you have is sufficient.
*/