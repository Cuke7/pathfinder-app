//


$(document).ready(function () {
	var element = document.getElementById('editor_holder');

	// Initialize the editor with a JSON schema
	var editor = new JSONEditor(document.getElementById('editor_holder'), {
			schema: {
				"title": "Fiche de personnage :",
				"type": "object",
				"format": "grid",
				"properties": {
					"name": {
						"type": "string",
						"title": "Nom",
						"options": {
							"grid_columns": 4
						}
					},
					"avatar_src": {
						"type": "string",
						"title": "Avatar (URL)",
						"options": {
							"grid_columns": 8
						}
					},
					"HP": {
						"type": "integer",
						"title": "HP",
						"options": {
							"grid_columns": 4
						}
					},
					"PM": {
						"type": "integer",
						"title": "PM",
						"options": {
							"grid_columns": 2
						}
					},
					"RPM": {
						"type": "integer",
						"title": "Regen PM",
						"options": {
							"grid_columns": 2
						}
					},
					"PE": {
						"type": "integer",
						"title": "PE",
						"options": {
							"grid_columns": 2
						}
					},
					"RPE": {
						"type": "integer",
						"title": "Regen PE",
						"options": {
							"grid_columns": 2
						}
					},
					"Cara": {
						"type": "object",
						"title": "Charactéristiques",
						"format": "grid",
						"properties": {
							"FOR": {
								"type": "integer",
								"title": "Force",
								"options": {
									"grid_columns": 3
								}
							},
							"END": {
								"type": "integer",
								"title": "Endurance",
								"options": {
									"grid_columns": 3
								}
							},
							"AGI": {
								"type": "integer",
								"title": "Agilité",
								"options": {
									"grid_columns": 3
								}
							},
							"VIT": {
								"type": "integer",
								"title": "Vitesse",
								"options": {
									"grid_columns": 3
								}
							},
							"INT": {
								"type": "integer",
								"title": "Intelligence",
								"options": {
									"grid_columns": 3
								}
							},
							"CHA": {
								"type": "integer",
								"title": "Charisme",
								"options": {
									"grid_columns": 3
								}
							},
							"SAG": {
								"type": "integer",
								"title": "Sagesse",
								"options": {
									"grid_columns": 3
								}
							},
							"VOL": {
								"type": "integer",
								"title": "Volonté",
								"options": {
									"grid_columns": 3
								}
							}
						}
					},
					"bonus_temp": {
						"type": "string",
						"format": "textarea",
						"title": "Bonus temporaire",
						"options": {
							"grid_columns": 6,
							"expand_height": true
						}
					},
					"malus_temp": {
						"type": "string",
						"format": "textarea",
						"title": "Malus temporaire",
						"options": {
							"grid_columns": 6
						}
					},
					"sorts": {
						"type": "array",
						"format": "table",
						"title": "Sorts",
						"options": {
							"grid_columns": 12
						},
						"items": {
							"type": "object",
							"title": "Sort",
							"format": "grid",
							"properties": {
								"name": {
									"type": "string",
									"title": "Nom",
									"options": {
										"grid_columns": 4
									}
								},
								"description": {
									"title": "Effets",
									"type": "string",
									"format": "textarea",
									"options": {
										"grid_columns": 9
									}
								},
								"PM_cost": {
									"title": "Coût en PM",
									"type": "integer",
									"options": {
										"grid_columns": 1
									}
								}
							}
						}
					},
					"tech": {
						"type": "array",
						"format": "table",
						"title": "Techniques",
						"options": {
							"grid_columns": 12
						},
						"items": {
							"type": "object",
							"title": "Technique",
							"format": "grid",
							"properties": {
								"name": {
									"type": "string",
									"title": "Nom",
									"options": {
										"grid_columns": 4
									}
								},
								"description": {
									"title": "Effets",
									"type": "string",
									"format": "textarea",
									"options": {
										"grid_columns": 9
									}
								},
								"PM_cost": {
									"title": "Coût en PE",
									"type": "integer",
									"options": {
										"grid_columns": 1
									}
								}
							}
						}
					},
					"posture": {
						"type": "array",
						"format": "table",
						"title": "Postures",
						"options": {
							"grid_columns": 12
						},
						"items": {
							"type": "object",
							"title": "Posture",
							"format": "grid",
							"properties": {
								"name": {
									"type": "string",
									"title": "Nom",
									"options": {
										"grid_columns": 6
									}
								},
								"description": {
									"title": "Effets",
									"type": "string",
									"format": "textarea",
									"options": {
										"grid_columns": 6
									}
								}
							}
						}
					},
					"inventaire": {
						"type": "array",
						"format": "table",
						"title": "Inventaire",
						"options": {
							"grid_columns": 12
						},
						"items": {
							"type": "object",
							"title": "Item",
							"properties": {
								"name": {
									"type": "string"
								},
								"quantity": {
									"type": "integer"
								}
							}
						}
					}
				}
			},
			"theme": "bootstrap4",
			"iconlib": "fontawesome5",
			"disable_array_delete_all_rows": true,
			"disable_array_delete_last_row": true,
			"disable_edit_json": true,
			"disable_properties": true,
			"expand_height": true,
			"disable_array_reorder": true,
			"disable_collapse": true
		});

	editor.on('ready', function () {
		// Now the api methods will be available
		editor.validate();
		var value = editor.getValue();
		//editor.disable();
	});
	//openNav2();
	document.getElementById("editor_holder").style.display = "none";
});


function avatar_clicked(id){
	
}

function openNav2() {
	document.getElementById("mySidenav2").style.width = "500px";
	closeNav();
}

function closeNav2() {
	document.getElementById("mySidenav2").style.width = "0px";
}
