<?php

namespace AdminUI\Action\View;

use FormKit;
use FormKit\Layout\FieldsetLayout;
use FormKit\Widget\HiddenInput;
use FormKit\Element\Form;
use FormKit\Element;
use FormKit\Widget\SubmitInput;
use FormKit\Widget\ButtonInput;
use DOMText;

/**
 *  $view = new StackView($action, array(
 *      'no_form' => true,
 *      'no_signature' => true,
 *      'form_id' => 'formId',
 *      'form_class' => 'product-form',
 *  ));
 *  $view->buildRelationalActionViewForExistingRecords($relationId, $relation);
 *  $view->buildRelationalActionViewForNewRecord($relationId,$relation);
 *
 * $action->asView( '...', [ fields: [ ] ] )
 * $action->asView( '...', [ skips: [ ] ] ).
 */
class StackView extends \WebAction\View\StackView
{
    public $ajax = false;

    public $method = 'POST';

    public $nested = false;

    public function createLayout()
    {
        return new FieldsetLayout();
    }

    public function createContainer()
    {
        $form = new Form();
        $form->enctype('multipart/form-data');
        $form->method($this->method);

        if ($this->option('ajax')) {
            $form->addClass('ajax-action');
        }
        if ($this->ajax) {
            $ajaxFlag = new HiddenInput('__ajax_request', array('value' => '1'));
            $form->addChild($ajaxFlag);
        }
        return $form;
    }

    public function build()
    {
        // for each widget, push it into stack
        $this->registerWidgets($this->getAvailableWidgets());
        if ($this->option('nested') && $this->action->nested) {
            $this->buildNestedSection();
        }
    }

    public function getAvailableWidgets()
    {
        $widgets = parent::getAvailableWidgets();
        $record = $this->getRecord();
        if ($record && $record->id) {
            return $widgets;
        }
        // XXX: hack
        return array_filter($widgets, function ($w) {
            return $w->name != 'id';
        });
    }

    public function afterBuild()
    {
        parent::afterBuild();
        $container = $this->getContainer();
        $signature = new HiddenInput('__action', array(
            'value' => $this->action->getSignature(),
        ));
        $container->addChild($signature);

        $csrfToken = new HiddenInput($this->action->csrfTokenFieldName, array(
            'value' => $this->action->getCSRFToken(),
        ));
        $container->addChild($csrfToken);


        $container->addChild($this->buildButtonGroup());
    }

    public function buildButtonGroup()
    {
        $record = $this->getRecord();
        $recordId = $record ? $record->id : null;
        $isCreate = !$recordId;

        $buttonGroup = new Element('div');
        $buttonGroup->setAttributes(array('class' => 'button-group'));

        if ($this->option('submit_btn')) {
            if ($isCreate) {
                $submit = new SubmitInput(null, array(
                    'class' => 'formkit-widget formkit-widget-submit create button',
                    'value' => $this->option('submit_label') ?: _('Create'),
                ));
                $buttonGroup->addChild($submit);
            } else {
                $submit = new SubmitInput(null, array(
                    'class' => 'formkit-widget formkit-widget-submit create button',
                    'value' => $this->option('submit_label') ?: _('Save'),
                ));
                $buttonGroup->addChild($submit);
            }
        }

        // button for closing edit region
        if ($this->option('close_btn')) {
            $fadeRemoveButton = new ButtonInput(null, array(
                'class' => 'formkit-widget formkit-widget-button button record-close-btn',
                'value' => $this->option('cancel_label') ?: _('Cancel'),
                'onclick' => '(function(o) {
                    Phifty.CRUD.closeEditRegion(o);
                })(this);',
            ));
            $buttonGroup->addChild(new DOMText("\n"));
            $buttonGroup->addChild($fadeRemoveButton);
        }

        return $buttonGroup;
    }
}
