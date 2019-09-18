
const princ = {
  bricks: (dataUserz) => {
    return `<p>frutta matta, user:${dataUserz.email}</p>`},
  logic: (dataUserz) => {
    $('body').empty().append(princ.bricks(dataUserz));
    console.log(dataUserz);
  },
};
const stages = [
  {
    bricks: `<p>log in</p>
  <input type="text" class="email" placeholder="e-mail" value="carlogambi@hotmail.it">
      <input type="password" class="password" placeholder="password" value="prova">
          <button type="button" class="buttonInt" >log in</button>
          <p class="errors" ></p>`,
    err: "<button type='button' class='recoverUsr'>X-wrong password/e-mail click here to recover-X</button>",
    logic() {
      $('.mutevole').empty().append(stages[0].bricks);
      $('.buttonInt').on('click', () => {
        const userEmail = $('.email').val();
        const password = $('.password').val();
        if (userEmail !== '' && password !== '') {
          $.post('/login', { userEmail, password }, (response) => {
            if (response.incoming === false) {
              $('.errors').empty().append(this.err);
            } else {
              window.location.href = `/user/${response.incoming}`;
            }
          });
        } else {
          $('.errors').empty().append(this.err);
        }
      });
    },
  },

  {
    bricks: `<p>create user</p>
        <input type="text" class="userName" placeholder="create user">
        <input type="text" class="email" placeholder="email">
        <input type="password" class="password" placeholder="password">
         <button type="button" class="buttonInt" >create </button>`,
    noUs: '<p class="errors">X-invalid user name-X</p>',
    noPssw: '<p class="errors">X-invalid password-X</p>',
    noEmail: '<p class="errors">X-no email found-X</p>',
    noNewUsr: '<p class="errors">X-username already existing-X</p>',
    logic: () => {
      $('.mutevole').empty().append(stages[1].bricks);
      $('.buttonInt').on('click', () => {
        let user; let pssw; let email;
        if ($('.userName').val() !== '') { $('.errors').empty(); user = $('.userName').val(); } else { $('.mutevole').append(stages[0].noUs); }
        if ($('.password').val() !== '') { $('.errors').empty(); pssw = $('.password').val(); } else { $('.mutevole').append(stages[0].noPssw); }
        if ($('.email').val() !== '') { $('.errors').empty(); email = $('.email').val(); } else { $('.mutevole').append(stages[0].noEmail); }
        if (user !== undefined && pssw !== undefined && email !== undefined) {
          $.post('/newUser', { user, pssw, email }, (response) => {
            if (response.response === 'yeah') {
              stages[2].logic();
            } else {
              $('.errors').empty();
              $('.mutevole').append(`<p class="errors">X ${response.response} X</p>`);
            }
          });
        }
      });
    },
  },

  {
    bricks: `<p>confirm user</p>
      <input type="text" class="confNumbInp" placeholder="valkey">
         <button type="button" class="confNumb" >confirm</button>`,
    noUs: '<p class="errors">X-invalid number-X</p>',
    logic: () => {
      $('.mutevole').empty().append(stages[2].bricks);

      $('.confNumb').on('click', () => {
        let confNumb;
        if ($('.confNumbInp').val() !== '') { $('.errors').empty(); confNumb = $('.confNumbInp').val(); }
        if (confNumb !== undefined) {
          $.post('/confNumb', { confNumb }, (info) => {
            console.log(info);
          });
        }
      });
    },
  },
  {
    bricks: `<p>recover password</p>
      <input type="text" class="confNumbInp" placeholder="e mail">
         <button type="button" class="confNumb" >send password</button>
         <p class="errors"></p>`,
    noUs: '<p class="errors">X-invalid email-X</p>',
    logic: () => {
      $('.mutevole').empty().append(stages[3].bricks);

      $('.confNumb').on('click', () => {
        let email;
        if ($('.confNumbInp').val() !== '') { $('.errors').empty(); email = $('.confNumbInp').val(); }
        if (email !== undefined) {
          $.post('/sendPssw', { email }, (info) => {
            $('.errors').empty().append(`<p>${info.response}</p>`);
          });
        }
      });
    },
  },

];
