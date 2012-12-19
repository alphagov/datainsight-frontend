DataInsightFrontend::Application.routes.draw do

  root :to => redirect("/performance")

  scope "/performance" do
    match "/" => "root#index", via: :get, as: 'root'
    match "dashboard" => "dashboard#index", via: :get
    match "dashboard/narrative" => "dashboard#narrative", via: :get
    match "dashboard/visits" => "dashboard#visits", via: :get
    match "dashboard/unique-visitors" => "dashboard#unique_visitors", via: :get
    match "dashboard/content-engagement" => "dashboard#format_success", via: :get
    match "dashboard/hourly-traffic" => "dashboard#hourly_traffic", via: :get

    if Settings.feature_toggles[:inside_government_dashboard]
      match "dashboard/government" => "inside_government#index", via: :get
      match "dashboard/government/content-engagement" => "inside_government#format_success", via: :get
      match "dashboard/government/most-entered-policies" => "inside_government#most_entered_policies", via: :get
      match "dashboard/government/visitors/weekly" => "inside_government#visitors_weekly", via: :get
      match "dashboard/government/narrative" => "inside_government#narrative", via: :get
      match "dashboard/government" => "inside_government#index", via: :get
    end

    #todo: pull out toggle for annotations
    if Settings.feature_toggles[:inside_government_annotations]
      match "dashboard/government/annotations" => "inside_government#annotations", via: :get
    end
  end
end
