const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

// GET /api/users. Select all users from user table in the DB and send it back as JSON.
router.get('/', (req, res) => {
    // Access our USER model and run .findAll() method
    User.findAll({
        attributes: { exclude: ['password' ]}
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// GET / api/users/1. Will return one user based on id
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
      .then(dbUserData => {
          if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id' });
              return;
          }
          res.json(dbUserData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// POST /api/users. Create a user, values from SQL are from the req.body.
router.post('/', (req,res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
      .then(dbUserData => {
          req.session.save(() => {
              req.session.user_id = dbUserData.id;
              req.session.username = dbUserData.username;
              req.session.loggedIn = true;

              req.json(dbUserData);
          });

        })
});
// Authentication route
router.post('/login', (req, res) => {
    // Query User table using findone for the emailed entered
    User.findOne({
        where: {
            email: req.body.email
        }
    }) .then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ messages: 'No user with that email address'});
            return;
        }
        // Verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});

router.post('/logout', (req,res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(4004).end();
    }
})


// PUT /api/users/1. Update existing data
router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
      .then(dbUserData => {
          if (!dbUserData[0]) {
              res.status(404).json({ message: 'No user found with this id'});
              return;
          }
          res.json(dbUserData);
      })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1. Delete user from the database
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
      .then(dbUserData => {
          if(!dbUserData) {
              res.status(404).json({ message: 'No user found with this id' });
              return;
          }
          res.json(dbUserData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

module.exports = router;
