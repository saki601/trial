    $(document).ready(function() {
  $('#methodSelect').on('change', function () {
    const method = $(this).val();
    if (method === 'GCash') {
      $('#refNumberField').show();
      $('#paymentDateField').hide();
      $('#referenceInput').prop('required', true);
      $('#paymentDateInput').prop('required', false);
    } else if (method === 'Cash') {
      $('#paymentDateField').show();
      $('#refNumberField').hide();
      $('#paymentDateInput').prop('required', true);
      $('#referenceInput').prop('required', false);
    } else {
      $('#refNumberField, #paymentDateField').hide();
      $('#referenceInput, #paymentDateInput').prop('required', false);
    }
  });

  $('#deleteEmployeeModal').on('click', '#confirmDelete', function() {
    // Find all checked checkboxes and remove their corresponding rows
    $('table tbody input[type="checkbox"]:checked').each(function() {
      $(this).closest('tr').remove();
    });

    // Close the modal after deletion
    $('#deleteEmployeeModal').modal('hide');
  });

  // Select All checkbox functionality
  $('#selectAll').on('change', function() {
    const isChecked = $(this).prop('checked');
    $('table tbody input[type="checkbox"]').prop('checked', isChecked);
  });

  // Add row selection on individual checkboxes
  $(document).on('change', 'table tbody input[type="checkbox"]', function() {
    const allChecked = $('table tbody input[type="checkbox"]').length === $('table tbody input[type="checkbox"]:checked').length;
    $('#selectAll').prop('checked', allChecked);
  });

  $('#orderSelect').on('change', function () {
    const order = $(this).val();
    let html = '';
    if (order === 'quantity') {
      html = `
        <div class="form-group"><label>Number of Orders</label><input type="number" class="form-control" name="quantity" required></div>
        <div class="form-group"><label>Total Weight (kg)</label><input type="number" class="form-control" name="weight" required></div>
      `;
    } else if (order === 'price') {
      html = `<div class="form-group"><label>Price Offered</label><input type="number" class="form-control" name="price" required></div>`;
    } else if (order === 'weight') {
      html = `<div class="form-group"><label>Weight (kg)</label><input type="number" class="form-control" name="weight" required></div>`;
    }
    $('#dynamicFields').html(html);
  }).trigger('change');

  $('#addForm').submit(function(e) {
    e.preventDefault();

    const name = $('input[name="name"]').val().trim();
    const messenger = $('#messengerInput').val().trim();
    const address = $('input[name="address"]').val().trim();
    const orderType = $('#orderSelect').val();
    const status = $('select[name="status"]').val();
    const method = $('#methodSelect').val();
    const reference = $('#referenceInput').val();
    const paymentDate = $('#paymentDateInput').val();
    const phone = $('#phoneInput').val().trim();

    if (!messenger && !phone) {
      alert("Please provide at least a Messenger Link or Phone Number.");
      $('#messengerInput, #phoneInput').addClass('is-invalid');
      return;
    }

    $('#messengerInput, #phoneInput').removeClass('is-invalid');

    let orderDetails = '';
    let total = 0;
    if (orderType === 'quantity') {
      const quantity = $('input[name="quantity"]').val();
      const weight = $('input[name="weight"]').val();
      orderDetails = `${quantity} pcs, ${weight} kg`;
      total = quantity * 150;
    } else if (orderType === 'price') {
      const price = $('input[name="price"]').val();
      orderDetails = `₱${price}`;
      total = price;
    } else if (orderType === 'weight') {
      const weight = $('input[name="weight"]').val();
      orderDetails = `${weight} kg`;
      total = weight * 170;
    }

    const paymentRef = method === 'GCash' ? reference : `Paid on ${paymentDate}`;

    const newRow = `
      <tr>
        <td><span class="custom-checkbox"><input type="checkbox"><label></label></span></td>
        <td>${name}</td>
        <td>${messenger ? `<a href="${messenger}" target="_blank">Link</a>` : 'N/A'}</td>
        <td>${address}</td>
        <td>${orderType}</td>
        <td>${orderDetails}</td>
        <td>${status}</td>
        <td>${method}</td>
        <td>${paymentRef}</td>
        <td>${phone || 'N/A'}</td>
        <td>₱${total}</td>
        <td>
          <a href="#" class="edit" title="Edit"><i class="material-icons">&#xE254;</i></a>
          <a href="#" class="delete" title="Delete"><i class="material-icons">&#xE872;</i></a>
        </td>
      </tr>
    `;

    $('table tbody').append(newRow);
    $('#addEmployeeModal').modal('hide');
    this.reset();
    $('#dynamicFields').html('');
    $('#orderSelect').trigger('change');
  });

  // Edit button functionality
  $(document).on('click', '.edit', function(e) {
    e.preventDefault();
    const row = $(this).closest('tr');
    const name = row.find('td:nth-child(2)').text();
    const messenger = row.find('td:nth-child(3)').text();
    const address = row.find('td:nth-child(4)').text();
    const orderDetails = row.find('td:nth-child(6)').text();
    const status = row.find('td:nth-child(7)').text();
    const method = row.find('td:nth-child(8)').text();
    const paymentRef = row.find('td:nth-child(9)').text();
    const phone = row.find('td:nth-child(10)').text();

    // Prepopulate the form with the row data
    $('input[name="name"]').val(name);
    $('#messengerInput').val(messenger.replace(/<\/?a[^>]+>/gi, ''));
    $('input[name="address"]').val(address);
    $('select[name="status"]').val(status);
    $('#methodSelect').val(method);
    $('#phoneInput').val(phone);

    // Set other fields based on order details
    // (this part would need parsing of `orderDetails` and pre-populating additional fields accordingly)

    $('#addEmployeeModal').modal('show');
  });

  // Delete button functionality
  $(document).on('click', '.delete', function(e) {
    e.preventDefault();
    const row = $(this).closest('tr');
    row.remove();  // Remove the row from the table
  });
});

