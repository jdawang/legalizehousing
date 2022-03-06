document.getElementById("t_pCode").addEventListener("keypress", function(event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		document.getElementById("b_pCode").click();
	}
});

var EMAIL_SUBJECT = EMAIL_SUBJECT_EN;
var EMAIL_BODY = EMAIL_BODY_EN;
var EMAIL_TEMPLATE_SUBJECT = EMAIL_TEMPLATE_SUBJECT_EN;
var EMAIL_TEMPLATE_BODY = EMAIL_TEMPLATE_BODY_EN;
var EMAIL_SUBJECTYH = EMAIL_SUBJECT_ENYH;
var EMAIL_BODYYH = EMAIL_BODY_ENYH;
var profileObj;

async function findProfile(){
	let pCode = document.getElementById("t_pCode").value.replace(/\s/g, "");
	pCode = pCode.toUpperCase();
	let user_name = document.getElementById("t_name").value;
	let user_email = document.getElementById("t_email").value;
	//alert(pCode);
	//alert(user_name);
	//alert(user_email);
	//let url = 'http://represent.opennorth.ca/postcodes/L5G4L3/?sets=federal-electoral-districts';
	//{"boundaries_centroid": [{"external_id": "35061", "related": {"boundary_set_url": "/boundary-sets/federal-electoral-districts/"}, "url": "/boundaries/federal-electoral-districts/35061/", "boundary_set_name": "Federal electoral district", "name": "Mississauga\u2014Lakeshore"}], "boundaries_concordance": [], "code": "L5G4L3", "province": "ON", "city": "Mississauga", "representatives_centroid": [{"related": {"boundary_url": "/boundaries/federal-electoral-districts/35061/", "representative_set_url": "/representative-sets/house-of-commons/"}, "photo_url": "https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/44/SpengemannSven_Lib.jpg", "personal_url": "", "last_name": "Spengemann", "source_url": "https://www.ourcommons.ca/Members/en/search?caucusId=all&province=all", "party_name": "Liberal", "extra": {"preferred_languages": ["English"]}, "offices": [{"type": "legislature", "tel": "1 613 992-4848", "postal": "House of Commons\nOttawa ON  K1A 0A6", "fax": "1 613 992-4848"}, {"type": "constituency", "tel": "1 905 273-8033", "postal": "Main office - Mississauga\n1077 North Service Road\nSuite 30\nMississauga ON  L4Y 1A6", "fax": "1 905 273-5040"}], "gender": "M", "url": "https://www.ourcommons.ca/Members/en/sven-spengemann(88852)", "district_name": "Mississauga\u2014Lakeshore", "name": "Sven Spengemann", "email": "sven.spengemann@parl.gc.ca", "representative_set_name": "House of Commons", "elected_office": "MPP", "first_name": "Sven"}], "centroid": {"type": "Point", "coordinates": [-79.580111, 43.579924]}}
	if (pCode == "") {
        alert("Enter a valid Postal Code");
        return false;
    }
	if (user_name == "") {
        alert("Enter your name");
        return false;
    }
	if (user_email == "") {
        alert("Enter your email");
        return false;
    }    
	
	let url = URL_DOMAIN + 'postcodes/' + pCode + '/?sets=' + PARAM_SETS;
	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function (data) {
			//alert(JSON.stringify(data));
                    
			profileObj = data;
            EMAIL_SUBJECT = EMAIL_SUBJECT_EN;
			EMAIL_SUBJECTYH = EMAIL_SUBJECT_ENYH;
			EMAIL_BODY = EMAIL_BODY_EN
                .replace('[INSERT MPP NAME HERE]',profileObj.representatives_centroid[0].name)
                .replace('[INSERT YOUR NAME HERE]',document.getElementById("t_name").value)
                .replace('[INSERT YOUR RIDING OR POSTAL CODE HERE]',document.getElementById("t_pCode").value)
                .replace('[INSERT YOUR EMAIL OR CONTACT INFO]',document.getElementById("t_email").value);
			EMAIL_BODYYH = EMAIL_BODY_ENYH
                .replace('[INSERT MPP NAME HERE]',profileObj.representatives_centroid[0].name)
                .replace('[INSERT YOUR NAME HERE]',document.getElementById("t_name").value)
                .replace('[INSERT YOUR RIDING OR POSTAL CODE HERE]',document.getElementById("t_pCode").value)
                .replace('[INSERT YOUR EMAIL OR CONTACT INFO]',document.getElementById("t_email").value);
			EMAIL_TEMPLATE_SUBJECT = EMAIL_TEMPLATE_SUBJECT_EN;
			EMAIL_TEMPLATE_BODY = EMAIL_TEMPLATE_BODY_EN;
			showProfile(data);
		})
		.catch(function (err) {
			console.log(err);
			clearProfile();
			let summary = '<h2 id="h_label">Invalid postal code</h2>';
			document.getElementById("h_profile").innerHTML = summary;
		});
}

function showProfile(data) {
	clearProfile();
	if (data.hasOwnProperty('representatives_centroid')) {
		let profileCount = '';
		if (data.representatives_centroid.length <= 0) {
			profileCount = "No MPP found";
		}
		else if (data.representatives_centroid.length == 1) {
			profileCount = "MPP found";
		}
		else {
			profileCount = data.representatives_centroid.length + " Profile found";
		}
		let subText = "On postal code " + document.getElementById("t_pCode").value;
		let summary = '<h2 id="h_label">' + profileCount + '</h2>' +
						'<small id="s_label">' + subText + '</small>';
		document.getElementById("h_profile").innerHTML = summary;
		
		let div = document.createElement("div");
		let content = '<div class="grid-widget grid-widget--listings">';

		for (let i = 0; i < data.representatives_centroid.length; i++) {
			let genderText = (data.representatives_centroid[i].gender == 'M')? 'him' : 'her';
			let emailTemplateSubject = EMAIL_TEMPLATE_SUBJECT.replace(/CANDIDATE_NAME_TO_REPLACE/gi, data.representatives_centroid[i].name);
			let emailTemplateBody = EMAIL_TEMPLATE_BODY.replace(/USER_NAME_TO_REPLACE/gi, document.getElementById("t_name").value)
										.replace(/CANDIDATE_NAME_TO_REPLACE/gi, data.representatives_centroid[i].name)
										.replace(/DISTRICT_TO_REPLACE/gi, data.representatives_centroid[i].district_name)
										.replace(/POSTAL_CODE_TO_REPLACE/gi, document.getElementById("t_pCode").value)
										.replace(/USER_EMAIL_TO_REPLACE/gi, document.getElementById("t_email").value);
			content = content +
						'<div class="img-responsive">' +
						'<div class="centre-block sizes="50vw" grid-widget__item">' +
						'<img class="center-block" src="' + data.representatives_centroid[i].photo_url + '" alt="' + data.representatives_centroid[i].name + '">' +
						'<div class="centre-block grid-widget__email_info">' +
						'<br/>' +
						'<h3>' + data.representatives_centroid[i].name + '</h3>' +
						'<small>' + data.representatives_centroid[i].district_name + '</small>' +
						'<br/>' +
						'<h4>Write to ' + data.representatives_centroid[i].name + ', to Minister of Housing Steve Clark, and to opposition housing critics and ask the provincial government to:</h4>' +
						'<small>1. Legalize 4 units and 4 storey homes on every plot in Ontario.</small>' +
						'<small>2. Legalize mid-rise housing along transit routes.</small>' +
						'<small>3. Stop municipal abuse of design guidelines and heritage designations that prevents homes from being built.</small>' +
						'<br/>' +
						'<small>Select your email client below, then replace the few parts in the [BRACKETS]:</small>' +
						'<small>' +
						'<div class="col-xs-2 justify-content-center text-center">' +
						'<h5><a id="gmail_text_' + data.representatives_centroid[i].name + '" href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=' + data.representatives_centroid[i].email + "; steve.clark@pc.ola.org; jbell-co@ndp.on.ca; sblais.mpp.co@liberal.ola.org; mschreiner-co@ola.org" + '&su=' + EMAIL_SUBJECT + '&body=' + EMAIL_BODY + '" class="email-header" target="_blank">Gmail</a></h5>' +
						'<a id="gmail_icon_' + data.representatives_centroid[i].name + '" href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=' + data.representatives_centroid[i].email + "; steve.clark@pc.ola.org; jbell-co@ndp.on.ca; sblais.mpp.co@liberal.ola.org; mschreiner-co@ola.org" + '&su=' + EMAIL_SUBJECT + '&body=' + EMAIL_BODY + '" target="_blank"><img src="assets/img/Gmail-Email.png" class="icon" alt="assets/img/No-Image.png"></a>' +
						'</div>' +
						'<div class="col-xs-2 col-xs-offset-1 justify-content-center text-center">' +
						'<h5><a id="outlook_text_' + data.representatives_centroid[i].name + '" href="https://outlook.live.com/mail/0/deeplink/compose?popoutv2=1&subject=' + EMAIL_SUBJECT + '&body=' + EMAIL_BODY + '&to=' + data.representatives_centroid[i].email + ", steve.clark@pc.ola.org, jbell-co@ndp.on.ca, sblais.mpp.co@liberal.ola.org, mschreiner-co@ola.org" + '&path=%2fmail%2faction%2fcompose" class="email-header" target="_blank">Outlook</a></h5>' +
						'<a id="outlook_icon_' + data.representatives_centroid[i].name + '" href="https://outlook.live.com/mail/0/deeplink/compose?popoutv2=1&subject=' + EMAIL_SUBJECT + '&body=' + EMAIL_BODY + '&to=' + data.representatives_centroid[i].email + ", steve.clark@pc.ola.org, jbell-co@ndp.on.ca, sblais.mpp.co@liberal.ola.org, mschreiner-co@ola.org" + '&path=%2fmail%2faction%2fcompose" class="email-header" target="_blank"><img src="assets/img/Outlook-Email.png" class="icon" alt="assets/img/No-Image.png"></a>' +
						'</div>' +
						'<div class="col-xs-2 col-xs-offset-1 justify-content-center text-center">' +
						'<h5><a id="yahoo_text_' + data.representatives_centroid[i].name + '" href="http://compose.mail.yahoo.com/?to=' + data.representatives_centroid[i].email + ", steve.clark@pc.ola.org, jbell-co@ndp.on.ca, sblais.mpp.co@liberal.ola.org, mschreiner-co@ola.org" + '&subj=' + EMAIL_SUBJECTYH + '&body=' + EMAIL_BODYYH + '" class="email-header" target="_blank">Yahoo</a></h5>' +
						'<a id="yahoo_icon_' + data.representatives_centroid[i].name + '" href="http://compose.mail.yahoo.com/?to=' + data.representatives_centroid[i].email + ", steve.clark@pc.ola.org, jbell-co@ndp.on.ca, sblais.mpp.co@liberal.ola.org, mschreiner-co@ola.org" + '&subj=' + EMAIL_SUBJECTYH + '&body=' + EMAIL_BODYYH + '" class="email-header" target="_blank"><img src="assets/img/Yahoo-Email.png" class="icon" alt="assets/img/No-Image.png"></a>' +
						'</div>' +
						'<div class="col-xs-2 col-xs-offset-1 justify-content-center text-center">' +
						'<h5><a id="other_mail_text_' + data.representatives_centroid[i].name + '" href="mailto:' + data.representatives_centroid[i].email + "; steve.clark@pc.ola.org, jbell-co@ndp.on.ca, sblais.mpp.co@liberal.ola.org, mschreiner-co@ola.org" + '?subject=' + EMAIL_SUBJECT + '&body=' + EMAIL_BODY + '" class="email-header">Other</a></h5>' +
						'<a id="other_mail_icon_' + data.representatives_centroid[i].name + '" href="mailto:' + data.representatives_centroid[i].email + "; steve.clark@pc.ola.org, jbell-co@ndp.on.ca, sblais.mpp.co@liberal.ola.org, mschreiner-co@ola.org" + '?subject=' + EMAIL_SUBJECT + '&body=' + EMAIL_BODY + '"><img src="assets/img/Other-Email.png" class="icon" alt="assets/img/No-Image.png"></a>' +
						'</div>' +
						'</small>' +
						'</br>' +
						'<small>Or, copy/paste the following text to / Ou, copiez et collez le courriel suivant à: <a href="mailto:' + data.representatives_centroid[i].email + '?subject=EMAIL_SUBJECT_EN&body=EMAIL_BODY_EN">' + data.representatives_centroid[i].email + '</a></small>' +
						'<br/>' +
						'<h4>Subject:</h4>' +
						'<small ID="t_mail_subject_' + data.representatives_centroid[i].name + '">' +
						emailTemplateSubject +
						'</small>' +
						'<br/>' +
						'<h4>Body (feel free to edit) / Texte (n\'hésitez pas à modifier):</h4>' +
						'<div class="email-template-input">' +
						'<textarea id="t_mail_body_' + data.representatives_centroid[i].name + '" class="email-template-textarea rounded-0 border-0 shadow-none" rows="25" cols="100">' +
						emailTemplateBody +
						'</textarea>' +
						'</div>' +
						'</div>' +
						'</div>';
		}
		content = content + '</div>';
		div.innerHTML = content;
		document.getElementById("d_profile").appendChild(div);
	}
    
}

function clearProfile() {
	document.getElementById("h_profile").innerHTML = "";
	document.getElementById("d_profile").innerHTML = "";
}

function selectionChanged(obj) {
	//let selectedText = obj.options[obj.selectedIndex].innerHTML;
    //let selectedValue = obj.value;
    //alert("Selected Text: " + selectedText + " Value: " + selectedValue);
	switch (obj.value) {
		case 'en':
			EMAIL_SUBJECT = EMAIL_SUBJECT_EN;
			EMAIL_BODY = EMAIL_BODY_EN
                .replace('[INSERT MPP NAME HERE]',profileObj.representatives_centroid[0].name)
                .replace('[INSERT YOUR NAME HERE]',document.getElementById("t_name").value)
                .replace('[INSERT YOUR RIDING OR POSTAL CODE HERE]',document.getElementById("t_pCode").value)
                .replace('[INSERT YOUR EMAIL OR CONTACT INFO]',document.getElementById("t_email").value);
			EMAIL_SUBJECTYH = EMAIL_SUBJECT_ENYH;
			EMAIL_BODYYH = EMAIL_BODY_ENYH
                .replace('[INSERT MPP NAME HERE]',profileObj.representatives_centroid[0].name)
                .replace('[INSERT YOUR NAME HERE]',document.getElementById("t_name").value)
                .replace('[INSERT YOUR RIDING OR POSTAL CODE HERE]',document.getElementById("t_pCode").value)
                .replace('[INSERT YOUR EMAIL OR CONTACT INFO]',document.getElementById("t_email").value);
			EMAIL_TEMPLATE_SUBJECT = EMAIL_TEMPLATE_SUBJECT_EN;
			EMAIL_TEMPLATE_BODY = EMAIL_TEMPLATE_BODY_EN;
			break;
		case 'fr':
			EMAIL_SUBJECT = EMAIL_SUBJECT_FR;
			EMAIL_BODY = EMAIL_BODY_FR
                .replace('[INSÉRER LE NOM DU DÉPUTÉ ICI]',profileObj.representatives_centroid[0].name)
                .replace('[INSÉRER VOTRE NOM]',document.getElementById("t_name").value)
                .replace('[INSÉRER VOTRE ADRESSE OU CODE POSTAL]',document.getElementById("t_pCode").value)
                .replace('[INSÉRER VOTRE COURRIEL OU COORDONNÉES]',document.getElementById("t_email").value);
			EMAIL_SUBJECTYH = EMAIL_SUBJECT_FRYH;
			EMAIL_BODYYH = EMAIL_BODY_FRYH
                .replace('[INSÉRER LE NOM DU DÉPUTÉ ICI]',profileObj.representatives_centroid[0].name)
                .replace('[INSÉRER VOTRE NOM]',document.getElementById("t_name").value)
                .replace('[INSÉRER VOTRE ADRESSE OU CODE POSTAL]',document.getElementById("t_pCode").value)
                .replace('[INSÉRER VOTRE COURRIEL OU COORDONNÉES]',document.getElementById("t_email").value);
			EMAIL_TEMPLATE_SUBJECT = EMAIL_TEMPLATE_SUBJECT_FR;
			EMAIL_TEMPLATE_BODY = EMAIL_TEMPLATE_BODY_FR;
			break;
		case 'enfr':
			EMAIL_SUBJECT = EMAIL_SUBJECT_ENFR;
			EMAIL_BODY = EMAIL_BODY_ENFR
                .replace('[INSERT MPP NAME HERE]',profileObj.representatives_centroid[0].name)
                .replace('[INSERT YOUR NAME HERE]',document.getElementById("t_name").value)
                .replace('[INSERT YOUR RIDING OR POSTAL CODE HERE]',document.getElementById("t_pCode").value)
                .replace('[INSERT YOUR EMAIL OR CONTACT INFO]',document.getElementById("t_email").value)
                .replace('[INSÉRER LE NOM DU DÉPUTÉ ICI]',profileObj.representatives_centroid[0].name)
                .replace('[INSÉRER VOTRE NOM]',document.getElementById("t_name").value)
                .replace('[INSÉRER VOTRE ADRESSE OU CODE POSTAL]',document.getElementById("t_pCode").value)
                .replace('[INSÉRER VOTRE COURRIEL OU COORDONNÉES]',document.getElementById("t_email").value);;
			EMAIL_SUBJECTYH = EMAIL_SUBJECT_ENFRYH;
			EMAIL_BODYYH = EMAIL_BODY_ENFRYH
                .replace('[INSERT MPP NAME HERE]',profileObj.representatives_centroid[0].name)
                .replace('[INSERT YOUR NAME HERE]',document.getElementById("t_name").value)
                .replace('[INSERT YOUR RIDING OR POSTAL CODE HERE]',document.getElementById("t_pCode").value)
                .replace('[INSERT YOUR EMAIL OR CONTACT INFO]',document.getElementById("t_email").value)
                .replace('[INSÉRER LE NOM DU DÉPUTÉ ICI]',profileObj.representatives_centroid[0].name)
                .replace('[INSÉRER VOTRE NOM]',document.getElementById("t_name").value)
                .replace('[INSÉRER VOTRE ADRESSE OU CODE POSTAL]',document.getElementById("t_pCode").value)
                .replace('[INSÉRER VOTRE COURRIEL OU COORDONNÉES]',document.getElementById("t_email").value);;
			EMAIL_TEMPLATE_SUBJECT = EMAIL_TEMPLATE_SUBJECT_ENFR;
			EMAIL_TEMPLATE_BODY = EMAIL_TEMPLATE_BODY_ENFR;
			break;
		default:
			console.log("Unknown selection!!!");
			break;
	}
	for (let i = 0; i < profileObj.representatives_centroid.length; i++) {
		let emailTemplateSubject = EMAIL_TEMPLATE_SUBJECT.replace(/CANDIDATE_NAME_TO_REPLACE/gi, profileObj.representatives_centroid[i].name);
		let emailTemplateBody = EMAIL_TEMPLATE_BODY.replace(/USER_NAME_TO_REPLACE/gi, document.getElementById("t_name").value)
									.replace(/CANDIDATE_NAME_TO_REPLACE/gi, profileObj.representatives_centroid[i].name)
									.replace(/DISTRICT_TO_REPLACE/gi, profileObj.representatives_centroid[i].district_name)
									.replace(/POSTAL_CODE_TO_REPLACE/gi, document.getElementById("t_pCode").value)
									.replace(/USER_EMAIL_TO_REPLACE/gi, document.getElementById("t_email").value);
		document.getElementById("gmail_text_" + profileObj.representatives_centroid[i].name).href = "https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=" + profileObj.representatives_centroid[i].email + "; steve.clark@pc.ola.org; jbell-co@ndp.on.ca; sblais.mpp.co@liberal.ola.org; mschreiner-co@ola.org" + "&su=" + EMAIL_SUBJECT + "&body=" + EMAIL_BODY;
		document.getElementById("gmail_icon_" + profileObj.representatives_centroid[i].name).href = "https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=" + profileObj.representatives_centroid[i].email + "; steve.clark@pc.ola.org; jbell-co@ndp.on.ca; sblais.mpp.co@liberal.ola.org; mschreiner-co@ola.org" + "&su=" + EMAIL_SUBJECT + "&body=" + EMAIL_BODY;		
		document.getElementById("outlook_text_" + profileObj.representatives_centroid[i].name).href = "https://outlook.live.com/mail/0/deeplink/compose?popoutv2=1&subject=" + EMAIL_SUBJECT + "&body=" + EMAIL_BODY + "&to=" + profileObj.representatives_centroid[i].email + ", steve.clark@pc.ola.org, jbell-co@ndp.on.ca, sblais.mpp.co@liberal.ola.org, mschreiner-co@ola.org" + "&path=%2fmail%2faction%2fcompose";
		document.getElementById("outlook_icon_" + profileObj.representatives_centroid[i].name).href = "https://outlook.live.com/mail/0/deeplink/compose?popoutv2=1&subject=" + EMAIL_SUBJECT + "&body=" + EMAIL_BODY + "&to=" + profileObj.representatives_centroid[i].email + ", steve.clark@pc.ola.org, jbell-co@ndp.on.ca, sblais.mpp.co@liberal.ola.org, mschreiner-co@ola.org" + "&path=%2fmail%2faction%2fcompose";
		document.getElementById("yahoo_text_" + profileObj.representatives_centroid[i].name).href = "http://compose.mail.yahoo.com/?to=" + profileObj.representatives_centroid[i].email + ", steve.clark@pc.ola.org, jbell-co@ndp.on.ca, sblais.mpp.co@liberal.ola.org, mschreiner-co@ola.org" + "&subj=" + EMAIL_SUBJECTYH + "&body=" + EMAIL_BODYYH + "%2523";
		document.getElementById("yahoo_icon_" + profileObj.representatives_centroid[i].name).href = "http://compose.mail.yahoo.com/?to=" + profileObj.representatives_centroid[i].email + ", steve.clark@pc.ola.org, jbell-co@ndp.on.ca, sblais.mpp.co@liberal.ola.org, mschreiner-co@ola.org" + "&subj=" + EMAIL_SUBJECTYH + "&body=" + EMAIL_BODYYH + "%2523";
		document.getElementById("other_mail_text_" + profileObj.representatives_centroid[i].name).href = "mailto:" + profileObj.representatives_centroid[i].email + ", steve.clark@pc.ola.org, jbell-co@ndp.on.ca, sblais.mpp.co@liberal.ola.org, mschreiner-co@ola.org" + "?subject=" + EMAIL_SUBJECT + "&body=" + EMAIL_BODY;
		document.getElementById("other_mail_icon_" + profileObj.representatives_centroid[i].name).href = "mailto:" + profileObj.representatives_centroid[i].email + ", steve.clark@pc.ola.org, jbell-co@ndp.on.ca, sblais.mpp.co@liberal.ola.org, mschreiner-co@ola.org" + "?subject=" + EMAIL_SUBJECT + "&body=" + EMAIL_BODY;
		document.getElementById("t_mail_subject_" + profileObj.representatives_centroid[i].name).innerHTML = emailTemplateSubject;
		document.getElementById("t_mail_body_" + profileObj.representatives_centroid[i].name).innerHTML = emailTemplateBody;
	}
}